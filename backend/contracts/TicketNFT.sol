// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketNFT is ERC721URIStorage, Ownable {
    uint256 private nextTokenId;
    mapping(uint256 => uint256) public tokenToEventId;
    address public ticketSale;

    constructor() ERC721("EventTicket", "ETK") Ownable(msg.sender) {}

    function setTicketSale(address _ticketSale) external onlyOwner {
        require(ticketSale == address(0), "TicketSale already set");
        ticketSale = _ticketSale;
    }

    function mintTicket(
        address to,
        string memory tokenURI,
        uint256 eventId
    ) external returns (uint256) {
        require(msg.sender == ticketSale, "Only TicketSale");
        uint256 tokenId = nextTokenId;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenToEventId[tokenId] = eventId;
        nextTokenId++;
        return tokenId;
    }

    function getEventId(uint256 tokenId) external view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenToEventId[tokenId];
    }
}
