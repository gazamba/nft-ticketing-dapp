// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./TicketNFT.sol";
import "./interfaces/IEventFactory.sol";

contract TicketVerification {
    IERC721 public ticketNFT;
    IEventFactory public eventFactory;

    constructor(address _ticketNFT, address _eventFactory) {
        ticketNFT = IERC721(_ticketNFT);
        eventFactory = IEventFactory(_eventFactory);
    }

    function verifyTicket(
        uint256 ticketId,
        address owner
    ) external view returns (bool, uint256) {
        try ticketNFT.ownerOf(ticketId) returns (address actualOwner) {
            uint256 eventId = TicketNFT(address(ticketNFT)).getEventId(
                ticketId
            );
            (, , , , , , , , bool canceled) = eventFactory.getEventDetails(
                eventId
            );
            return (actualOwner == owner && !canceled, eventId);
        } catch {
            return (false, 0);
        }
    }
}
