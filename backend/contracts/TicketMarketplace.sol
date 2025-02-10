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
    IERC721 public ticketContract;

    event TicketListed(uint256 indexed ticketId, address seller, uint256 price);
    event TicketSold(uint256 indexed ticketId, address buyer);

    constructor(address _ticketContract) {
        ticketContract = IERC721(_ticketContract);
    }

    function listTicket(uint256 ticketId, uint256 price) external {
        require(
            ticketContract.ownerOf(ticketId) == msg.sender,
            "Not the owner"
        );
        listings[ticketId] = Listing(ticketId, msg.sender, price);
        emit TicketListed(ticketId, msg.sender, price);
    }

    function buyTicket(uint256 ticketId) external payable nonReentrant {
        Listing memory listing = listings[ticketId];
        require(msg.value == listing.price, "Incorrect price");

        payable(listing.seller).transfer(msg.value);
        ticketContract.safeTransferFrom(listing.seller, msg.sender, ticketId);

        delete listings[ticketId];

        emit TicketSold(ticketId, msg.sender);
    }
}
