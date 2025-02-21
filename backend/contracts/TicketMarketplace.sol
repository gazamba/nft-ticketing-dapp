// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TicketMarketplace is ReentrancyGuard {
    struct Listing {
        uint256 ticketId;
        address seller;
        uint256 price;
    }

    mapping(uint256 => Listing) public listings;
    IERC721 public ticketNFT;

    event TicketListed(uint256 indexed ticketId, address seller, uint256 price);
    event TicketSold(uint256 indexed ticketId, address buyer);

    constructor(address _ticketNFT) {
        ticketNFT = IERC721(_ticketNFT);
    }

    function listTicket(uint256 ticketId, uint256 price) external {
        require(ticketNFT.ownerOf(ticketId) == msg.sender, "Not the owner");
        require(
            ticketNFT.getApproved(ticketId) == address(this) ||
                ticketNFT.isApprovedForAll(msg.sender, address(this)),
            "Not approved"
        );
        listings[ticketId] = Listing(ticketId, msg.sender, price);
        emit TicketListed(ticketId, msg.sender, price);
    }

    function buyTicket(uint256 ticketId) external payable nonReentrant {
        Listing memory listing = listings[ticketId];
        require(listing.seller != address(0), "Ticket not listed");
        require(msg.value == listing.price, "Incorrect price");

        (bool sent, ) = listing.seller.call{value: msg.value}("");
        require(sent, "Payment failed");
        ticketNFT.safeTransferFrom(listing.seller, msg.sender, ticketId);

        delete listings[ticketId];
        emit TicketSold(ticketId, msg.sender);
    }
}
