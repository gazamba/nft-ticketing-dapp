// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EventFactory {
    string[] public categories = [
        "IT & Technology", "Music", "Festivals", "Sports", "Business & Entrepreneurship",
        "Education & Learning", "Health & Wellness", "Arts & Culture", "Food & Beverage", "Science & Innovation",
        "Gaming & eSports", "Finance & Investments", "Networking & Social", "Marketing & Advertising", "Nonprofit & Charity",
        "Leadership & Development", "Sustainability & Environment", "Social Media & Digital Marketing", "Lifestyle & Fashion",
        "Religious & Spiritual", "Travel & Adventure", "Automotive & Transportation", "Real Estate & Property",
        "Public Sector & Government", "Other"
    ];

    struct Event {
        uint256 eventId;
        string metadataCID;
        uint256 totalTickets;
        uint256 soldTickets;
        address organizer;
    }

    uint256 private nextEventId;
    mapping(uint256 => Event) public events;

    event EventCreated(uint256 indexed eventId, string metadataCID, uint256 totalTickets, address indexed organizer);
    event TicketsSold(uint256 indexed eventId, uint256 ticketsSold);

    function createEvent(string memory _metadataCID, uint256 _totalTickets) external {
        require(_totalTickets > 0, "Total tickets must be greater than zero");

        events[nextEventId] = Event({
            eventId: nextEventId,
            metadataCID: _metadataCID,
            totalTickets: _totalTickets,
            soldTickets: 0,
            organizer: msg.sender
        });

        emit EventCreated(nextEventId, _metadataCID, _totalTickets, msg.sender);
        nextEventId++;
    }

    function updateSoldTickets(uint256 eventId, uint256 amount) external {
        require(eventId < nextEventId, "Event does not exist");
        require(events[eventId].soldTickets + amount <= events[eventId].totalTickets, "Not enough tickets available");

        events[eventId].soldTickets += amount;
        emit TicketsSold(eventId, amount);
    }

    function getEventDetails(uint256 eventId) external view returns (uint256, uint256, uint256, address) {
        Event storage e = events[eventId];
        return (e.eventId, e.totalTickets, e.soldTickets, e.organizer);
    }
}