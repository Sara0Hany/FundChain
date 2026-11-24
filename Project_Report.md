# FundChain
## Blockchain-Based Decentralized Crowdfunding Platform

### Academic Project Report

---

## 1. Abstract

FundChain is a decentralized crowdfunding application developed using Ethereum blockchain technology and Solidity smart contracts.

The project provides a platform where users can create fundraising campaigns, specify funding goals and deadlines, and receive contributions from other users using ETH.

Unlike traditional crowdfunding platforms, FundChain uses smart contracts to manage campaign operations and financial transactions on the blockchain.

The application integrates MetaMask for wallet management and Ethers.js for communication between the frontend and the deployed smart contract.

The project is deployed on the Ethereum Sepolia test network.

---

## 2. Introduction

Crowdfunding is a method of collecting financial contributions from multiple individuals to support a specific project, idea, or initiative.

Traditional crowdfunding systems generally rely on centralized platforms to manage campaigns and transactions.

This introduces several challenges, including:

- Dependence on centralized service providers.
- Limited transparency in financial operations.
- Platform management and transaction control.
- Trust requirements between campaign creators and contributors.

Blockchain technology offers an alternative approach through decentralized networks and smart contracts.

FundChain demonstrates how crowdfunding operations can be implemented using blockchain-based smart contracts.

---

## 3. Problem Statement

Traditional crowdfunding platforms require users to trust a centralized organization to manage campaign funds and execute financial operations.

The project addresses this problem by implementing a decentralized crowdfunding system where campaign information and financial transactions are managed through a smart contract.

The main objective is to demonstrate transparent campaign management and automated financial operations.

---

## 4. Project Objectives

The main objectives are:

1. Develop a decentralized crowdfunding application.
2. Implement crowdfunding functionality using Solidity.
3. Allow users to create fundraising campaigns.
4. Enable users to contribute ETH.
5. Track campaign funding progress.
6. Implement campaign finalization.
7. Allow creators to withdraw funds from successful campaigns.
8. Provide a refund mechanism for failed campaigns.
9. Integrate MetaMask for wallet connectivity.
10. Develop a user-friendly web interface.

---

## 5. Technologies and Tools

### 5.1 Solidity

Solidity is the programming language used to develop the smart contract deployed on Ethereum.

It manages campaign information and crowdfunding operations.

### 5.2 Ethereum Blockchain

Ethereum provides the decentralized execution environment for the smart contract.

### 5.3 Ethereum Sepolia

Sepolia is used as the test network for deploying and testing the application without using real ETH.

### 5.4 Remix IDE

Remix is used to write, compile, deploy, and interact with the Solidity smart contract.

### 5.5 MetaMask

MetaMask allows users to connect their wallets and authorize transactions.

### 5.6 Ethers.js

Ethers.js connects the frontend application to the Ethereum blockchain and provides functions for interacting with the smart contract.

### 5.7 HTML, CSS, and JavaScript

These technologies are used to build the frontend interface and implement user interactions.

---

## 6. System Architecture

The system consists of three primary layers.

### 6.1 Frontend Layer

The frontend provides the user interface and includes:

- Wallet connection.
- Campaign creation form.
- Campaign exploration.
- Search and filtering.
- Campaign statistics.
- Campaign details.
- Contribution and campaign management actions.

### 6.2 Wallet Layer

MetaMask acts as the connection between the user and the Ethereum network.

It is responsible for:

- Connecting user accounts.
- Selecting the network.
- Approving transactions.
- Signing blockchain transactions.

### 6.3 Smart Contract Layer

The Solidity smart contract manages the crowdfunding operations.

It stores campaign information and processes the transactions associated with each campaign.

### Architecture Flow

User → Frontend → Ethers.js → MetaMask → Ethereum Sepolia → Smart Contract

---

## 7. Smart Contract Design

The main contract is named `Crowdfunding`.

### 7.1 Campaign Structure

Each campaign contains the following information:

| Variable | Description |
|---|---|
| creator | Address of the campaign creator |
| title | Campaign title |
| fundingGoal | Required funding amount |
| deadline | Campaign closing timestamp |
| totalRaised | Total contributions received |
| status | Current campaign status |
| withdrawn | Indicates whether funds were withdrawn |

### 7.2 Campaign Status

The campaign status is represented by an enumeration:

- Active (0): The campaign is active.
- Successful (1): The campaign has successfully reached its funding goal.
- Failed (2): The campaign has failed.

### 7.3 Campaign Counter

The contract uses `campaignCount` to track the total number of campaigns.

### 7.4 Contributions Mapping

The contract stores contribution information for each campaign and contributor address.

This allows the application to retrieve the amount contributed by an individual user.

---

## 8. Smart Contract Functions

### 8.1 createCampaign()

Creates a new fundraising campaign.

Inputs:
- Campaign title.
- Funding goal.
- Duration in days.

The contract records the campaign creator, funding goal, deadline, and initial campaign status.

### 8.2 contribute()

Allows users to send ETH to an active campaign.

The contribution is recorded, and the total amount raised is updated.

### 8.3 finalizeCampaign()

Finalizes a campaign when the required conditions are met.

The campaign status is updated according to its funding result.

### 8.4 withdrawFunds()

Allows the creator to withdraw funds from a successful campaign.

### 8.5 claimRefund()

Provides a mechanism for contributors to request their contributions back when a campaign fails.

### 8.6 campaigns()

Retrieves the stored information of a specific campaign.

### 8.7 contributions()

Retrieves the contribution amount associated with a campaign and a particular wallet address.

### 8.8 campaignCount()

Returns the total number of campaigns created.

---

## 9. Frontend Implementation

The frontend is implemented using HTML, CSS, and JavaScript.

### 9.1 Wallet Connection

The application uses MetaMask and Ethers.js to connect to the Ethereum Sepolia network.

### 9.2 Create Campaign Interface

Users can enter:

- Campaign title.
- Funding goal in ETH.
- Campaign duration in days.

The information is submitted to the smart contract through `createCampaign()`.

### 9.3 Explore Campaigns

The application retrieves campaign information from the blockchain and displays it in individual campaign cards.

### 9.4 Dashboard

The dashboard displays:

- Total campaigns.
- Total ETH raised.
- Active campaigns.
- Successful campaigns.
- Failed campaigns.

### 9.5 Search and Filtering

Users can search campaigns by title or creator address and filter them according to campaign status.

The application also provides filters for campaigns created or supported by the connected wallet.

### 9.6 Campaign Details

A dedicated details window displays campaign information, including funding goal, total raised, deadline, status, and individual contribution.

---

## 10. Main System Workflow

### Scenario 1: Successful Campaign

1. A user connects their MetaMask wallet.
2. The user creates a new campaign.
3. Other users contribute ETH.
4. The campaign reaches its funding goal.
5. The campaign is finalized.
6. The status becomes Successful.
7. The creator withdraws the funds.

### Scenario 2: Failed Campaign

1. A user creates a campaign.
2. Contributors send ETH.
3. The campaign deadline passes without reaching its funding goal.
4. The campaign is finalized.
5. The status becomes Failed.
6. Contributors can use the refund mechanism.

The failed-campaign refund scenario is implemented in the application but was not included in the completed practical tests.

---

## 11. Deployment Information

| Item | Information |
|---|---|
| Contract Name | Crowdfunding |
| Network | Ethereum Sepolia |
| Chain ID | 11155111 |
| Development Environment | Remix IDE |
| Wallet | MetaMask |
| Frontend Environment | Visual Studio Code |
| Contract Address | 0x49FC9dDF3c394B345A33784edf941e11a813abd1 |

---

## 12. Testing and Results

The following operations were successfully executed:

| Test Case | Result |
|---|---|
| Connect MetaMask wallet | Successful |
| Connect to Sepolia | Successful |
| Deploy smart contract | Successful |
| Create campaign | Successful |
| Contribute ETH | Successful |
| Update campaign funding progress | Successful |
| Finalize successful campaign | Successful |
| Withdraw campaign funds | Successful |
| Load campaign statistics | Successful |
| Search and filter campaigns | Implemented |
| Display campaign details | Implemented |
| Claim refund | Implemented, not tested |

The testing was conducted using the Ethereum Sepolia test network and test ETH.

---

## 13. Limitations

The current version has some limitations:

- It operates on a test network rather than Ethereum Mainnet.
- It does not include a professional security audit.
- Campaign descriptions and image uploads are not included.
- User profiles are not implemented.
- Refund functionality has not been practically tested.
- The application does not include a decentralized storage solution for campaign media.

---

## 14. Future Improvements

Potential future developments include:

1. Integrating IPFS for decentralized campaign images and descriptions.
2. Adding user profiles and campaign histories.
3. Implementing campaign categories.
4. Adding notifications for campaign updates.
5. Improving the platform's security.
6. Conducting independent smart contract audits.
7. Deploying the application on a production blockchain network after appropriate security and operational reviews.

---

## 15. Conclusion

FundChain demonstrates the application of blockchain technology in decentralized crowdfunding.

By combining Solidity smart contracts, Ethereum, MetaMask, and a web-based frontend, the project provides a practical demonstration of how crowdfunding activities can be managed through decentralized technology.

The project successfully demonstrates campaign creation, ETH contributions, campaign finalization, and fund withdrawal on the Ethereum Sepolia test network.

It also provides a foundation for future improvements in decentralized fundraising applications.

---

**Project Name:** FundChain

**Project Type:** Blockchain Application

**Development Network:** Ethereum Sepolia

**Primary Programming Language:** Solidity

**Frontend Technologies:** HTML, CSS, JavaScript