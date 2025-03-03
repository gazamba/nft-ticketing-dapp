// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./TicketNFT.sol";
import "./interfaces/IEventFactory.sol";

contract TicketSale is ReentrancyGuard {
    TicketNFT public ticketNFT;
    IEventFactory public eventFactory;
    mapping(uint256 => mapping(address => uint256[])) public purchasedTickets;

    event TicketPurchased(
        uint256 indexed eventId,
        address indexed buyer,
        uint256 tokenId
    );
    event RefundClaimed(
        uint256 indexed eventId,
        address indexed buyer,
        uint256 amount
    );

    constructor(address _ticketNFT, address _eventFactory) {
        ticketNFT = TicketNFT(_ticketNFT);
        eventFactory = IEventFactory(_eventFactory);
    }

    function setEventPrice(uint256 eventId, uint256 price) external {
        require(msg.sender == address(eventFactory), "Only EventFactory");
    }

    function buyTickets(
        uint256 eventId,
        uint256 amount
    ) external payable nonReentrant {
        (
            uint256 id,
            ,
            string memory ticketNFTMetadataBaseURI,
            ,
            uint256 totalTickets,
            uint256 soldTickets,
            uint256 price,
            ,
            bool canceled
        ) = eventFactory.getEventDetails(eventId);
        require(id == eventId, "Event does not exist");
        require(!canceled, "Event is canceled");
        require(soldTickets + amount <= totalTickets, "Not enough tickets");

        uint256 totalCost = price * amount;
        require(msg.value >= totalCost, "Insufficient payment");

        for (uint256 i = 0; i < amount; i++) {
            string memory tokenURI = string(
                abi.encodePacked(
                    ticketNFTMetadataBaseURI,
                    "/",
                    Strings.toString(soldTickets + i + 1)
                )
            );
            uint256 tokenId = ticketNFT.mintTicket(
                msg.sender,
                tokenURI,
                eventId
            );
            purchasedTickets[eventId][msg.sender].push(tokenId);
            emit TicketPurchased(eventId, msg.sender, tokenId);
        }

        eventFactory.updateSoldTickets(eventId, amount);
        if (msg.value > totalCost) {
            (bool sent, ) = msg.sender.call{value: msg.value - totalCost}("");
            require(sent, "Refund failed");
        }
    }

    function claimRefund(uint256 eventId) external nonReentrant {
        (uint256 id, , , , , , uint256 price, , bool canceled) = eventFactory
            .getEventDetails(eventId);
        require(id == eventId, "Event does not exist");
        require(canceled, "Event not canceled");

        uint256[] storage ticketIds = purchasedTickets[eventId][msg.sender];
        uint256 refundAmount = ticketIds.length * price;
        require(refundAmount > 0, "No refund available");

        delete purchasedTickets[eventId][msg.sender];
        (bool sent, ) = msg.sender.call{value: refundAmount}("");
        require(sent, "Refund failed");
        emit RefundClaimed(eventId, msg.sender, refundAmount);
    }
}
