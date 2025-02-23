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
            string memory metadataCID,
            uint256 totalTickets,
            uint256 soldTickets,
            address organizer,
            bool canceled
        );

    function updateSoldTickets(uint256 eventId, uint256 amount) external;

    function getTicketMetadataBaseURI(
        uint256 eventId
    ) external view returns (string memory);
}
