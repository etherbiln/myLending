// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LendingPlatform is Ownable {
    IERC20 public token; // ERC20 token adresi

    struct Loan {
        uint256 amount;
        uint256 interestRate; // Yüzde olarak
        uint256 dueDate;
        address borrower;
        bool repaid;
    }

    mapping(address => Loan[]) public loans;

    constructor(IERC20 _token) Ownable (msg.sender) {
        token = _token;
    }

    function lend(uint256 amount, uint256 interestRate, uint256 duration) external {
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        Loan memory newLoan = Loan({
            amount: amount,
            interestRate: interestRate,
            dueDate: block.timestamp + duration,
            borrower: msg.sender,
            repaid: false
        });

        loans[msg.sender].push(newLoan);
    }

    function repay(uint256 loanIndex) external {
        Loan storage loan = loans[msg.sender][loanIndex];
        require(!loan.repaid, "Loan already repaid");
        require(block.timestamp <= loan.dueDate, "Loan overdue");

        uint256 amountToRepay = loan.amount + (loan.amount * loan.interestRate / 100);
        require(token.transferFrom(msg.sender, address(this), amountToRepay), "Repayment failed");

        loan.repaid = true;
    }
}
