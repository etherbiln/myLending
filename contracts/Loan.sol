// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Loan {
    IERC20 public token;
    address public lender;
    address public borrower;
    uint256 public amount;
    uint256 public interestRate;
    uint256 public dueDate;
    bool public repaid;

    constructor(IERC20 _token, address _lender, address _borrower, uint256 _amount, uint256 _interestRate, uint256 _dueDate) {
        token = _token;
        lender = _lender;
        borrower = _borrower;
        amount = _amount;
        interestRate = _interestRate;
        dueDate = _dueDate;
        repaid = false;
    }

    function repay() external {
        require(msg.sender == borrower, "Only borrower can repay");
        require(!repaid, "Loan already repaid");
        require(block.timestamp <= dueDate, "Loan overdue");

        uint256 amountToRepay = amount + (amount * interestRate / 100);
        require(token.transferFrom(borrower, lender, amountToRepay), "Repayment failed");

        repaid = true;
    }
}
