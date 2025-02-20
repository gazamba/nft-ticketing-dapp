// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./TicketNFT.sol";

interface IEventFactory {
    function getEventDetails(
        uint256 eventId
    ) external view returns (uint256, uint256, uint256, address);

    function updateSoldTickets(uint256 eventId, uint256 amount) external;
}

contract TicketSale is ReentrancyGuard {
    TicketNFT public ticketNFT;
    IEventFactory public eventFactory;

    event TicketPurchased(
        uint256 indexed eventId,
        address indexed buyer,
        uint256 tokenId
    );

    constructor(address _ticketNFT, address _eventFactory) {
        ticketNFT = TicketNFT(_ticketNFT);
        eventFactory = IEventFactory(_eventFactory);
    }

    function buyTicket(uint256 _eventId) external payable nonReentrant {
        (
            uint256 eventId,
            uint256 totalTickets,
            uint256 soldTickets,
            address organizer
        ) = eventFactory.getEventDetails(_eventId);

        require(totalTickets > 0, "Event does not exist");
        require(soldTickets < totalTickets, "Sold out");

        uint256 tokenId = ticketNFT.mintTicket(msg.sender, "");

        eventFactory.updateSoldTickets(_eventId, 1);

        payable(organizer).transfer(msg.value);

        emit TicketPurchased(_eventId, msg.sender, tokenId);
    }
}
