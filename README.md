# MyLending

MyLending is a lending platform operating on the Ethereum blockchain. This platform provides an ecosystem where users can lend and repay tokens. It is designed as a decentralized finance (DeFi) application using smart contracts.

## Features

- **Token Lending:** Users can lend tokens by specifying an interest rate and a maturity period.
- **Repayment:** Borrowers can repay within the specified period.
- **Smart Contracts:** Transactions are conducted securely and transparently through smart contracts.

## Installation

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/etherbiln/MyLending.git
    cd MyLending
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Deploy Smart Contracts Using Hardhat:**
    ```bash
    npx hardhat compile
    npx hardhat run scripts/deploy.js --network sepolia
    ```

## Usage

1. **Lending:**
    - Log in to the platform.
    - Specify the amount of tokens you want to lend, the interest rate, and the maturity period.
    - Confirm the transaction.

2. **Repayment:**
    - Log in to the platform.
    - Select the amount of borrowed tokens you want to repay.
    - Confirm the transaction.

## Contributing

To contribute, please submit a pull request or open an issue. All contributions and feedback are welcome!

## Contact

If you have any questions or feedback, please contact us at yakupbln00@gmail.com.

---