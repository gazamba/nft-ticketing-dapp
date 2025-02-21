// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TicketVerification {
    IERC721 public ticketNFT;

    constructor(address _ticketNFT) {
        ticketNFT = IERC721(_ticketNFT);
    }

    function verifyTicket(
        uint256 ticketId,
        address owner
    ) external view returns (bool) {
        try ticketNFT.ownerOf(ticketId) returns (address actualOwner) {
            return actualOwner == owner;
        } catch {
            return false;
        }
    }
}
