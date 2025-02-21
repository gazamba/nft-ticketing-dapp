// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./TicketNFT.sol";
import "./interfaces/IEventFactory.sol";

contract TicketSale is ReentrancyGuard {
    TicketNFT public ticketNFT;
    IEventFactory public eventFactory;
    mapping(uint256 => uint256) public eventPrices;
    mapping(uint256 => mapping(address => uint256)) public refunds;

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
        (, , , , address organizer, ) = eventFactory.getEventDetails(eventId);
        require(msg.sender == organizer, "Only organizer");
        require(eventPrices[eventId] == 0, "Price already set");
        eventPrices[eventId] = price;
    }

    function buyTickets(
        uint256 eventId,
        uint256 amount,
        string memory ticketMetadataBaseURI
    ) external payable nonReentrant {
        (
            uint256 id,
            ,
            uint256 totalTickets,
            uint256 soldTickets,
            ,
            bool canceled
        ) = eventFactory.getEventDetails(eventId);

        require(id == eventId, "Event does not exist");
        require(!canceled, "Event is canceled");
        require(soldTickets + amount <= totalTickets, "Not enough tickets");

        uint256 price = eventPrices[eventId];
        require(msg.value >= price * amount, "Insufficient payment");

        for (uint256 i = 0; i < amount; i++) {
            string memory tokenURI = string(
                abi.encodePacked(
                    ticketMetadataBaseURI,
                    "/",
                    Strings.toString(soldTickets + i + 1)
                )
            );
            uint256 tokenId = ticketNFT.mintTicket(
                msg.sender,
                tokenURI,
                eventId
            );
            emit TicketPurchased(eventId, msg.sender, tokenId);
        }

        eventFactory.updateSoldTickets(eventId, amount);
        refunds[eventId][msg.sender] += msg.value;
    }

    function claimRefund(uint256 eventId) external nonReentrant {
        (, , , , , bool canceled) = eventFactory.getEventDetails(eventId);
        require(canceled, "Event not canceled");
        uint256 refundAmount = refunds[eventId][msg.sender];
        require(refundAmount > 0, "No refund available");

        refunds[eventId][msg.sender] = 0;
        (bool sent, ) = msg.sender.call{value: refundAmount}("");
        require(sent, "Refund failed");
        emit RefundClaimed(eventId, msg.sender, refundAmount);
    }
}
