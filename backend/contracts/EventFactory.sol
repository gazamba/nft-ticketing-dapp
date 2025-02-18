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
        address organizer;
    }

    uint256 private nextEventId;
    mapping(uint256 => Event) public events;

    event EventCreated(
        uint256 indexed eventId,
        string metadataCID,
        address indexed organizer
    );

    function createEvent(
        string memory _metadataCID,

    ) external {
        events[nextEventId] = Event(
            nextEventId,
            _metadataCID,
            msg.sender
        );
        emit EventCreated(nextEventId, _metadataCID, msg.sender);
        nextEventId++;
    }

    function getNextEventId() external view returns (uint256) {
        return nextEventId;
    }

    function getCategories() external view returns (string[] memory) {
        return categories;
    }
}
