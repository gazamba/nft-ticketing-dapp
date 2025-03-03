// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IEventFactory.sol";

contract TicketNFT is ERC721URIStorage, Ownable {
    uint256 private nextTokenId;
    mapping(uint256 => uint256) public tokenToEventId;
    address public ticketSale;
    IEventFactory public eventFactory;

    constructor(
        address _eventFactory
    ) ERC721("EventTicket", "ETK") Ownable(msg.sender) {
        eventFactory = IEventFactory(_eventFactory);
    }

    function setTicketSale(address _ticketSale) external onlyOwner {
        require(_ticketSale != address(0), "Invalid address");
        ticketSale = _ticketSale;
    }

    function mintTicket(
        address to,
        string memory tokenURI,
        uint256 eventId
    ) external returns (uint256) {
        require(msg.sender == ticketSale, "Only TicketSale");
        (, , , , , , , , bool canceled) = eventFactory.getEventDetails(eventId);
        require(!canceled, "Event canceled");

        uint256 tokenId = nextTokenId;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenToEventId[tokenId] = eventId;
        unchecked {
            nextTokenId++;
        }
        return tokenId;
    }

    function getEventId(uint256 tokenId) external view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenToEventId[tokenId];
    }
}
