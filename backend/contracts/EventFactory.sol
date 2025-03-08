// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./TicketSale.sol";

contract EventFactory is Ownable {
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
        string pinataGroupId;
        string category;
        uint256 totalTickets;
        uint256 soldTickets;
        uint256 ticketPrice;
        address organizer;
        bool canceled;
        mapping(uint256 => string) ticketCIDs;
    }

    uint256 public nextEventId = 1;
    mapping(uint256 => Event) public events;
    TicketSale public ticketSale;

    event EventCreated(
        uint256 indexed eventId,
        string metadataCID,
        string pinataGroupId,
        string category,
        uint256 totalTickets,
        address indexed organizer
    );
    event EventCanceled(uint256 indexed eventId);

    constructor() Ownable(msg.sender) {}

    function setTicketSale(address _ticketSale) external onlyOwner {
        require(_ticketSale != address(0), "Invalid address");
        ticketSale = TicketSale(_ticketSale);
    }

    function createEvent(
        string memory _metadataCID,
        string memory _pinataGroupId,
        string memory _category,
        uint256 _totalTickets,
        uint256 _ticketPrice,
        uint256[] memory tokenIds,
        string[] memory ticketCIDs
    ) external {
        require(_totalTickets > 0, "Total tickets must be greater than zero");
        require(_ticketPrice > 0, "Ticket price must be set");
        require(address(ticketSale) != address(0), "TicketSale not set");
        require(
            bytes(_pinataGroupId).length > 0,
            "Pinata group id must be set"
        );
        require(
            tokenIds.length == ticketCIDs.length,
            "Token IDs and CIDs must match"
        );
        require(
            tokenIds.length == _totalTickets,
            "Must provide CIDs for all tickets"
        );

        uint256 eventId = nextEventId;
        Event storage newEvent = events[eventId];
        newEvent.eventId = eventId;
        newEvent.metadataCID = _metadataCID;
        newEvent.pinataGroupId = _pinataGroupId;
        newEvent.category = _category;
        newEvent.totalTickets = _totalTickets;
        newEvent.soldTickets = 0;
        newEvent.ticketPrice = _ticketPrice;
        newEvent.organizer = msg.sender;
        newEvent.canceled = false;

        for (uint256 i = 0; i < tokenIds.length; i++) {
            newEvent.ticketCIDs[tokenIds[i]] = ticketCIDs[i];
        }

        nextEventId++;
        emit EventCreated(
            eventId,
            _metadataCID,
            _pinataGroupId,
            _category,
            _totalTickets,
            msg.sender
        );
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
            string memory pinataGroupId,
            string memory category,
            uint256 totalTickets,
            uint256 soldTickets,
            uint256 ticketPrice,
            address organizer,
            bool canceled
        )
    {
        require(eventId < nextEventId, "Event does not exist");
        Event storage e = events[eventId];
        return (
            e.eventId,
            e.metadataCID,
            e.pinataGroupId,
            e.category,
            e.totalTickets,
            e.soldTickets,
            e.ticketPrice,
            e.organizer,
            e.canceled
        );
    }

    function isValidTicketCID(
        uint256 eventId,
        uint256 tokenId,
        string memory cid
    ) external view returns (bool) {
        require(eventId < nextEventId, "Event does not exist");
        string memory expectedCID = events[eventId].ticketCIDs[tokenId];
        return
            keccak256(abi.encodePacked(cid)) ==
            keccak256(abi.encodePacked(expectedCID)) &&
            bytes(expectedCID).length > 0;
    }

    function getAllCategories() external view returns (string[] memory) {
        return categories;
    }
}
