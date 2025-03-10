// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEventFactory {
    function getEventDetails(
        uint256 _eventId
    )
        external
        view
        returns (
            uint256 eventId,
            string memory eventMetadataCID,
            string memory pinataGroupId,
            string memory category,
            uint256 totalTickets,
            uint256 soldTickets,
            uint256 ticketPrice,
            address organizer,
            bool canceled
        );

    function updateSoldTickets(uint256 eventId, uint256 amount) external;

    function isValidTicketCID(
        uint256 eventId,
        uint256 tokenId,
        string memory cid
    ) external view returns (bool);
}
