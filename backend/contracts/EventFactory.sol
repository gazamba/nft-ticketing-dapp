// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TicketSale.sol";

contract EventFactory {
    string[] public categories = [
        "IT & Technology",
        "Music",
        "Festivals",
        "Sports",
        "Business & Entrepreneurship",
        "Education & Learning",
        "Health & Wellness",
        "Arts & Culture",
        "Food & Beverage",
        "Science & Innovation",
        "Gaming & eSports",
        "Finance & Investments",
        "Networking & Social",
        "Marketing & Advertising",
        "Nonprofit & Charity",
        "Leadership & Development",
        "Sustainability & Environment",
        "Social Media & Digital Marketing",
        "Lifestyle & Fashion",
        "Religious & Spiritual",
        "Travel & Adventure",
        "Automotive & Transportation",
        "Real Estate & Property",
        "Public Sector & Government",
        "Other"
    ];

    struct Event {
        uint256 eventId;
        string metadataCID;
        uint256 totalTickets;
        uint256 soldTickets;
        address organizer;
        bool canceled;
    }

    uint256 public nextEventId;
    mapping(uint256 => Event) public events;
    TicketSale public ticketSale;

    event EventCreated(
        uint256 indexed eventId,
        string metadataCID,
        uint256 totalTickets,
        address indexed organizer
    );
    event EventCanceled(uint256 indexed eventId);

    constructor() {}

    function setTicketSale(address _ticketSale) external {
        require(nextEventId == 0, "Can only set before events are created");
        require(address(ticketSale) == address(0), "TicketSale already set");
        require(_ticketSale != address(0), "Invalid address"); // Prevent setting to 0x0
        ticketSale = TicketSale(_ticketSale);
    }

    function createEvent(
        string memory _metadataCID,
        uint256 _totalTickets,
        uint256 _ticketPrice
    ) external {
        require(_totalTickets > 0, "Total tickets must be greater than zero");
        require(_ticketPrice > 0, "Ticket price must be set");
        require(address(ticketSale) != address(0), "TicketSale not set");

        events[nextEventId] = Event({
            eventId: nextEventId,
            metadataCID: _metadataCID,
            totalTickets: _totalTickets,
            soldTickets: 0,
            organizer: msg.sender,
            canceled: false
        });

        ticketSale.setEventPrice(nextEventId, _ticketPrice);
        emit EventCreated(nextEventId, _metadataCID, _totalTickets, msg.sender);
        nextEventId++;
    }

    function cancelEvent(uint256 eventId) external {
        Event storage e = events[eventId];
        require(e.organizer == msg.sender, "Only organizer can cancel");
        require(eventId < nextEventId, "Event does not exist");
        require(!e.canceled, "Event already canceled");

        e.canceled = true;
        emit EventCanceled(eventId);
    }

    function updateSoldTickets(uint256 eventId, uint256 amount) external {
        require(msg.sender == address(ticketSale), "Only TicketSale");
        require(eventId < nextEventId, "Event does not exist");
        require(!events[eventId].canceled, "Event is canceled");
        require(
            events[eventId].soldTickets + amount <=
                events[eventId].totalTickets,
            "Not enough tickets"
        );
        events[eventId].soldTickets += amount;
    }

    function getEventDetails(
        uint256 eventId
    )
        external
        view
        returns (
            uint256 eventId_,
            string memory metadataCID,
            uint256 totalTickets,
            uint256 soldTickets,
            address organizer,
            bool canceled
        )
    {
        require(eventId < nextEventId, "Event does not exist");
        Event memory e = events[eventId];
        return (
            e.eventId,
            e.metadataCID,
            e.totalTickets,
            e.soldTickets,
            e.organizer,
            e.canceled
        );
    }

    function getAllCategories() external view returns (string[] memory) {
        return categories;
    }
}
