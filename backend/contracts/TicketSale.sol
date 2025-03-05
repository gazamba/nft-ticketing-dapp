// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./TicketNFT.sol";
import "./interfaces/IEventFactory.sol";

contract TicketSale is ReentrancyGuard, Ownable {
    TicketNFT public ticketNFT;
    IEventFactory public eventFactory;
    mapping(uint256 => mapping(address => uint256[])) public purchasedTickets;
    string private pinataBaseURI =
        "https://chocolate-solid-antlion-52.mypinata.cloud/ipfs/";

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
    event BaseURIUpdated(string newBaseURI);

    constructor(address _ticketNFT, address _eventFactory) Ownable(msg.sender) {
        ticketNFT = TicketNFT(_ticketNFT);
        eventFactory = IEventFactory(_eventFactory);
    }

    function setPinataBaseURI(string memory newBaseURI) external onlyOwner {
        require(bytes(newBaseURI).length > 0, "Base URI cannot be empty");
        pinataBaseURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    function buyTickets(
        uint256 eventId,
        uint256[] memory tokenIds,
        string[] memory tokenCIDs
    ) external payable nonReentrant {
        require(
            tokenIds.length == tokenCIDs.length,
            "Token IDs and CIDs must match"
        );
        (
            uint256 id,
            ,
            ,
            ,
            uint256 totalTickets,
            uint256 soldTickets,
            uint256 price,
            ,
            bool canceled
        ) = eventFactory.getEventDetails(eventId);
        require(id == eventId, "Event does not exist");
        require(!canceled, "Event is canceled");
        require(
            soldTickets + tokenIds.length <= totalTickets,
            "Not enough tickets"
        );

        uint256 totalCost = price * tokenIds.length;
        require(msg.value >= totalCost, "Insufficient payment");

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                eventFactory.isValidTicketCID(
                    eventId,
                    tokenIds[i],
                    tokenCIDs[i]
                ),
                "Invalid CID for tokenId"
            );
            uint256 tokenId = ticketNFT.mintTicket(
                msg.sender,
                tokenIds[i],
                eventId,
                tokenCIDs[i]
            );
            purchasedTickets[eventId][msg.sender].push(tokenId);
            emit TicketPurchased(eventId, msg.sender, tokenId);
        }

        eventFactory.updateSoldTickets(eventId, tokenIds.length);
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

    function getPinataBaseURI() external view returns (string memory) {
        return pinataBaseURI;
    }
}
