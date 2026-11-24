# FundChain
### Decentralized Crowdfunding Platform Powered by Blockchain

**FundChain** is a decentralized crowdfunding platform built on the Ethereum blockchain. It allows users to create fundraising campaigns, contribute ETH to projects, track funding progress, and manage campaign funds through smart contracts.

The platform aims to provide a transparent and decentralized fundraising experience without relying on a traditional centralized intermediary.

---

## 1. Project Overview

Traditional crowdfunding platforms typically depend on centralized organizations to manage campaigns and financial transactions.

FundChain uses blockchain technology and Solidity smart contracts to manage the crowdfunding process transparently.

Users can:
- Connect their Ethereum wallet.
- Create new fundraising campaigns.
- Set funding goals and campaign durations.
- Contribute ETH to active campaigns.
- Monitor campaign progress.
- Finalize campaigns.
- Withdraw funds from successful campaigns.
- Claim refunds from failed campaigns.

## 2. Main Features

### Wallet Integration
- MetaMask wallet connection.
- Ethereum Sepolia test network support.
- Display connected wallet address.
- Automatic network switching request.

### Campaign Management
- Create campaigns with a title, funding goal, and duration.
- Assign a unique campaign ID.
- Store campaign information on the blockchain.
- Display campaign status and deadline.

### Contributions
- Allow users to contribute ETH to active campaigns.
- Record contributions on the blockchain.
- Track individual user contributions.

### Campaign Finalization
- Finalize campaigns after reaching their funding goal or passing their deadline.
- Mark campaigns as Successful or Failed.

### Fund Management
- Allow campaign creators to withdraw funds from successful campaigns.
- Provide a refund mechanism for contributors in failed campaigns.

### Dashboard
- Total number of campaigns.
- Total amount raised.
- Active campaigns.
- Successful campaigns.
- Failed campaigns.

### Search and Filtering
- Search campaigns by title or creator address.
- Filter campaigns by status.
- Display campaigns created by the connected wallet.
- Display campaigns supported by the connected wallet.

### Campaign Details
- View campaign information.
- Display funding progress.
- Show the creator's address.
- Display contribution information and campaign status.

---

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| Solidity | Smart contract development |
| Ethereum | Blockchain platform |
| Sepolia | Ethereum test network |
| Remix IDE | Smart contract development and deployment |
| MetaMask | Wallet connection and transaction approval |
| JavaScript | Frontend logic and blockchain interaction |
| HTML5 | Frontend structure |
| CSS3 | User interface styling |
| Ethers.js v6 | Communication between frontend and smart contract |
| Visual Studio Code | Frontend development |

---

## 4. System Architecture

FundChain consists of three main layers:

**1. Frontend Layer**

Built using HTML, CSS, and JavaScript. It provides the user interface for creating campaigns, exploring campaigns, and interacting with the platform.

**2. Wallet Layer**

MetaMask connects users to the Ethereum Sepolia network and allows them to approve blockchain transactions.

**3. Smart Contract Layer**

The Solidity smart contract handles campaign creation, contributions, campaign finalization, fund withdrawal, and refunds.

### Transaction Flow

User → Frontend → MetaMask → Ethereum Sepolia → Smart Contract

---

## 5. Smart Contract Functions

The Crowdfunding smart contract provides the following main functions:

| Function | Description |
|---|---|
| createCampaign() | Creates a new fundraising campaign |
| contribute() | Allows users to contribute ETH |
| finalizeCampaign() | Finalizes an eligible campaign |
| withdrawFunds() | Allows the creator to withdraw funds from a successful campaign |
| claimRefund() | Allows contributors to claim refunds from failed campaigns |
| campaigns() | Retrieves campaign information |
| contributions() | Retrieves a user's contribution to a campaign |
| campaignCount() | Returns the total number of campaigns |

---

## 6. Campaign Status

The campaign status is represented using an enumeration:

| Value | Status | Description |
|---|---|---|
| 0 | Active | Campaign is accepting contributions |
| 1 | Successful | Campaign has successfully reached its funding goal |
| 2 | Failed | Campaign did not reach its funding goal within the allowed period |

---

## 7. Smart Contract Deployment

**Network:** Ethereum Sepolia Testnet

**Contract Name:** Crowdfunding

**Contract Address:**

`0x49FC9dDF3c394B345A33784edf941e11a813abd1`

**Network Chain ID:** 11155111

The contract was deployed using Remix IDE and tested using the Sepolia test network.

---

## 8. Project Structure

```text
FundChain/
│
├── index.html
├── style.css
├── app.js
├── abi.json
└── README.md
```

**File descriptions:**

- `index.html`: Defines the platform's user interface.
- `style.css`: Contains the visual design and responsive styling.
- `app.js`: Handles wallet connection, smart contract interactions, and frontend functionality.
- `abi.json`: Contains the Application Binary Interface used to interact with the deployed smart contract.
- `README.md`: Provides project information and setup instructions.

---

## 9. Installation and Setup

### Prerequisites

Before running the project, make sure you have:

- Visual Studio Code.
- Google Chrome or another supported browser.
- MetaMask browser extension.
- An Ethereum Sepolia wallet.
- Sepolia test ETH.
- Live Server extension in Visual Studio Code.

### Step 1: Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### Step 2: Open the Project

Open the FundChain folder in Visual Studio Code.

### Step 3: Configure the ABI

Make sure `abi.json` contains the ABI exported from the deployed Crowdfunding smart contract.

### Step 4: Run the Application

Open `index.html` using the Live Server extension.

### Step 5: Connect MetaMask

1. Open the FundChain application.
2. Click Connect Wallet.
3. Approve the connection in MetaMask.
4. Select the Ethereum Sepolia network.
5. Start creating and exploring campaigns.

---

## 10. Testing

The following operations have been executed on the Ethereum Sepolia test network:

| Test | Result |
|---|---|
| Wallet connection | Successful |
| Smart contract deployment | Successful |
| Campaign creation | Successful |
| ETH contribution | Successful |
| Campaign finalization | Successful |
| Withdrawal of campaign funds | Successful |
| Campaign dashboard | Successful |
| Search and filtering | Implemented |
| Campaign details | Implemented |
| Refund mechanism | Implemented, not tested |

Note: The refund mechanism has not been included in the completed test results.

---

## 11. Future Improvements

Possible future improvements include:

- Campaign descriptions and image uploads.
- Campaign categories.
- User profiles.
- Transaction history.
- Campaign sharing.
- Advanced campaign analytics.
- Automated notifications.
- Improved smart contract security and independent auditing.

---

## 12. Disclaimer

FundChain is an academic blockchain project developed for educational and demonstration purposes.

It operates on the Ethereum Sepolia test network and uses test ETH. It is not intended for real financial transactions or production use.

The smart contract has not undergone an independent professional security audit.

---

## 13. Project Goal

The main objective of FundChain is to demonstrate how blockchain technology and smart contracts can be used to build a transparent, decentralized, and accessible crowdfunding platform.