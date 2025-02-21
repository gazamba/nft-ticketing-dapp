// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TicketVerification {
    IERC721 public ticketContract;

    constructor(address _ticketContract) {
        ticketContract = IERC721(_ticketContract);
    }

    function verifyTicket(
        uint256 ticketId,
        address owner
    ) external view returns (bool) {
        try ticketContract.ownerOf(ticketId) returns (address actualOwner) {
            return actualOwner == owner;
        } catch {
            return false;
        }
    }
}
