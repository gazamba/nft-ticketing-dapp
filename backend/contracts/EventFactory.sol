// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EventFactory {
    struct Event {
        uint256 eventId;
        string name;
        string date;
        string location;
        uint256 ticketPrice;
        uint256 totalTickets;
        address organizer;
    }

    uint256 private nextEventId;
    mapping(uint256 => Event) public events;

    event EventCreated(uint256 indexed eventId, string name, address indexed organizer);

    function createEvent(
        string memory _name,
        string memory _date,
        string memory _location,
        uint256 _ticketPrice,
        uint256 _totalTickets
    ) external {
        events[nextEventId] = Event(nextEventId, _name, _date, _location, _ticketPrice, _totalTickets, msg.sender);
        emit EventCreated(nextEventId, _name, msg.sender);
        nextEventId++;
    }
}
