// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IEventFactory.sol";
import "./TicketSale.sol";

contract TicketNFT is ERC721URIStorage, Ownable {
    mapping(uint256 => uint256) public tokenToEventId;
    mapping(uint256 => bool) public ticketUsed;
    TicketSale public ticketSale;
    IEventFactory public eventFactory;

    constructor(
        address _eventFactory
    ) ERC721("EventTicket", "ETK") Ownable(msg.sender) {
        eventFactory = IEventFactory(_eventFactory);
    }

    function setTicketSale(address _ticketSale) external onlyOwner {
        require(_ticketSale != address(0), "Invalid address");
        ticketSale = TicketSale(_ticketSale);
    }

    function mintTicket(
        address to,
        uint256 tokenId,
        uint256 eventId,
        string memory tokenCID
    ) external returns (uint256) {
        require(msg.sender == address(ticketSale), "Only TicketSale");
        (, , , , , , , , bool canceled) = eventFactory.getEventDetails(eventId);
        require(!canceled, "Event canceled");
        require(!exists(tokenId), "Token already minted");
        require(
            eventFactory.isValidTicketCID(eventId, tokenId, tokenCID),
            "Invalid CID for tokenId"
        );

        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenCID);
        tokenToEventId[tokenId] = eventId;
        ticketUsed[tokenId] = false;
        return tokenId;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        return _ownerOf(tokenId) != address(0); // Use _ownerOf from ERC721
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(exists(tokenId), "ERC721: URI query for nonexistent token");
        string memory cid = super.tokenURI(tokenId);
        return string(abi.encodePacked(ticketSale.getPinataBaseURI(), cid));
    }

    function verifyTicket(
        uint256 tokenId,
        address owner
    ) external view returns (bool) {
        require(exists(tokenId), "Ticket does not exist");
        uint256 eventId = tokenToEventId[tokenId];
        (, , , , , , , , bool canceled) = eventFactory.getEventDetails(eventId);
        return ownerOf(tokenId) == owner && !ticketUsed[tokenId] && !canceled;
    }

    function markTicketUsed(uint256 tokenId) external onlyOwner {
        require(exists(tokenId), "Ticket does not exist");
        require(!ticketUsed[tokenId], "Ticket already used");
        ticketUsed[tokenId] = true;
    }

    function getEventId(uint256 tokenId) external view returns (uint256) {
        require(exists(tokenId), "Token does not exist");
        return tokenToEventId[tokenId];
    }
}
