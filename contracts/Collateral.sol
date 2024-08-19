// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Collateral {
    IERC20 public token;
    mapping(address => uint256) public collateral;

    constructor(IERC20 _token) {
        token = _token;
    }

    function depositCollateral(uint256 amount) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        collateral[msg.sender] += amount;
    }

    function withdrawCollateral(uint256 amount) external {
        require(collateral[msg.sender] >= amount, "Insufficient collateral");
        collateral[msg.sender] -= amount;
        require(token.transfer(msg.sender, amount), "Transfer failed");
    }
}
