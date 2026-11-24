
/* =====================================================
   FUNDCHAIN - DECENTRALIZED CROWDFUNDING PLATFORM
   Ethereum Sepolia Testnet
===================================================== */

// ================= CONFIGURATION =================

const CONTRACT_ADDRESS =
    "0x49FC9dDF3c394B345A33784edf941e11a813abd1";

const SEPOLIA_CHAIN_ID = 11155111n;

let provider = null;
let signer = null;
let contract = null;
let currentAccount = null;


// ================= GENERAL HELPERS =================

function updateText(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
}

function shortAddress(address) {
    return address.slice(0, 8) + "..." + address.slice(-6);
}

function formatETH(value) {
    return Number(ethers.formatEther(value)).toFixed(4);
}

function showError(error) {
    console.error(error);

    return error.shortMessage ||
           error.reason ||
           error.message ||
           "An unexpected error occurred.";
}

function addDetail(parent, label, value) {
    const p = document.createElement("p");

    const strong = document.createElement("strong");
    strong.textContent = label + ": ";

    p.appendChild(strong);
    p.appendChild(document.createTextNode(String(value)));

    parent.appendChild(p);
}

function createButton(label, callback) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", callback);

    return button;
}


// ================= LOAD CONTRACT ABI =================

async function loadContractABI() {

    const response = await fetch("./abi.json", {
        cache: "no-store"
    });

    if (!response.ok) {
        throw new Error("Cannot load abi.json.");
    }

    const data = await response.json();

    const abi = Array.isArray(data) ? data : data.abi;

    if (!Array.isArray(abi)) {
        throw new Error("Invalid ABI format.");
    }

    return abi;
}


// ================= WALLET CONNECTION =================

function updateWalletInterface(account) {

    currentAccount = account;

    updateText(
        "walletStatus",
        "Wallet Connected Successfully!"
    );

    updateText(
        "networkStatus",
        "Network: Ethereum Sepolia"
    );

    updateText(
        "accountStatus",
        "Account: " + account
    );

    updateText(
        "connectWallet",
        shortAddress(account)
    );
}


async function initializeWallet(account) {

    if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
    }

    provider = new ethers.BrowserProvider(window.ethereum);

    let network = await provider.getNetwork();

    if (network.chainId !== SEPOLIA_CHAIN_ID) {

        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0xaa36a7" }]
        });

        provider = new ethers.BrowserProvider(window.ethereum);

        network = await provider.getNetwork();
    }

    if (network.chainId !== SEPOLIA_CHAIN_ID) {
        throw new Error("Please select Ethereum Sepolia.");
    }

    signer = await provider.getSigner();

    currentAccount = await signer.getAddress();

    if (
        account &&
        account.toLowerCase() !== currentAccount.toLowerCase()
    ) {
        throw new Error("Wallet account changed. Please reconnect.");
    }

    const abi = await loadContractABI();

    contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        abi,
        signer
    );

    updateWalletInterface(currentAccount);

    console.log("Connected:", currentAccount);
    console.log("Contract:", contract);

    await loadCampaigns();
}


async function connectWallet() {

    try {

        if (!window.ethereum) {
            throw new Error("Please install MetaMask.");
        }

        if (!window.ethers) {
            throw new Error("Ethers.js is not loaded.");
        }

        updateText("walletStatus", "Connecting wallet...");

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        await initializeWallet(accounts[0]);

    } catch (error) {

        updateText("walletStatus", "Wallet connection failed.");

        alert(showError(error));
    }
}


// ================= CREATE CAMPAIGN =================

async function createCampaign(event) {

    event.preventDefault();

    const message = document.getElementById("createStatus");

    try {

        if (!contract) {
            throw new Error("Connect your wallet first.");
        }

        const title = document
            .getElementById("campaignTitle")
            .value.trim();

        const goal = document
            .getElementById("campaignGoal")
            .value.trim();

        const duration = document
            .getElementById("campaignDuration")
            .value.trim();

        if (!title || !goal || !duration) {
            throw new Error("Please fill in all fields.");
        }

        if (title.length > 100) {
            throw new Error("Campaign title is too long.");
        }

        if (
            !Number.isSafeInteger(Number(duration)) ||
            Number(duration) <= 0
        ) {
            throw new Error("Duration must be a positive whole number.");
        }

        const goalInWei = ethers.parseEther(goal);

        if (goalInWei <= 0n) {
            throw new Error("Funding goal must be greater than zero.");
        }

        message.textContent = "Confirm transaction in MetaMask...";

        const tx = await contract.createCampaign(
            title,
            goalInWei,
            BigInt(duration)
        );

        message.textContent = "Waiting for confirmation...";

        await tx.wait();

        message.textContent = "Campaign created successfully!";

        document.getElementById("createCampaignForm").reset();

        await loadCampaigns();

    } catch (error) {

        message.textContent = "Error: " + showError(error);
    }
}


// ================= DASHBOARD STATISTICS =================

function updateStatistics(
    total,
    raised,
    active,
    successful,
    failed
) {

    updateText("totalCampaigns", total);

    updateText("totalRaised", formatETH(raised) + " ETH");

    updateText("activeCampaigns", active);

    updateText("successfulCampaigns", successful);

    updateText("failedCampaigns", failed);
}


function resetStatistics() {

    updateText("totalCampaigns", "0");
    updateText("totalRaised", "0 ETH");
    updateText("activeCampaigns", "0");
    updateText("successfulCampaigns", "0");
    updateText("failedCampaigns", "0");
}


// ================= LOAD CAMPAIGNS =================

async function loadCampaigns() {

    const container = document.getElementById("campaignsContainer");

    if (!contract || !currentAccount) {

        container.textContent =
            "Connect your wallet to view campaigns.";

        resetStatistics();

        return;
    }

    try {

        container.textContent = "Loading campaigns...";

        const count = await contract.campaignCount();

        const latestBlock = await provider.getBlock("latest");

        if (!latestBlock) {
            throw new Error("Cannot read latest blockchain block.");
        }

        const chainTime = Number(latestBlock.timestamp);

        let totalRaisedAll = 0n;
        let activeCount = 0;
        let successfulCount = 0;
        let failedCount = 0;

        const statuses = [
            "Active",
            "Successful",
            "Failed"
        ];

        if (count === 0n) {

            container.innerHTML =
                "<p>No campaigns yet. Be the first to create one!</p>";

            updateStatistics(0, 0n, 0, 0, 0);

            return;
        }

        container.innerHTML = "";

        for (let i = 0; i < Number(count); i++) {

            const campaign = await contract.campaigns(i);

            const creator = campaign[0];
            const title = campaign[1];
            const fundingGoal = campaign[2];
            const deadline = Number(campaign[3]);
            const totalRaised = campaign[4];
            const campaignStatus = Number(campaign[5]);
            const withdrawn = campaign[6];

            const userContribution =
                await contract.contributions(i, currentAccount);

            totalRaisedAll += totalRaised;

            if (campaignStatus === 0) activeCount++;
            if (campaignStatus === 1) successfulCount++;
            if (campaignStatus === 2) failedCount++;

            const goalETH = Number(ethers.formatEther(fundingGoal));
            const raisedETH = Number(ethers.formatEther(totalRaised));
            const contributionETH =
                Number(ethers.formatEther(userContribution));

            const progress = goalETH > 0
                ? Math.min(100, raisedETH / goalETH * 100)
                : 0;

            const deadlinePassed = chainTime >= deadline;
            const goalReached = totalRaised >= fundingGoal;

            const isCreator =
                creator.toLowerCase() === currentAccount.toLowerCase();

            const canFinalize =
                campaignStatus === 0 &&
                (deadlinePassed || goalReached);

            const card = document.createElement("div");

            card.className = "campaign-card";

            // SEARCH AND FILTER DATA

            card.dataset.title = title.toLowerCase();
            card.dataset.creator = creator.toLowerCase();
            card.dataset.status = statuses[campaignStatus] || "unknown";
            card.dataset.isCreator = isCreator ? "true" : "false";
            card.dataset.hasContribution =
                userContribution > 0n ? "true" : "false";

            // CAMPAIGN TITLE

            const heading = document.createElement("h3");
            heading.textContent = title;
            card.appendChild(heading);

            // CAMPAIGN INFORMATION

            addDetail(card, "Campaign ID", i);
            addDetail(card, "Creator", shortAddress(creator));
            addDetail(card, "Goal", goalETH + " ETH");
            addDetail(card, "Raised", raisedETH + " ETH");

            addDetail(
                card,
                "Deadline",
                new Date(deadline * 1000).toLocaleString()
            );

            addDetail(
                card,
                "Status",
                statuses[campaignStatus] || "Unknown"
            );

            // PROGRESS BAR

            const progressBar = document.createElement("div");
            progressBar.className = "progress-bar";

            const progressFill = document.createElement("div");
            progressFill.className = "progress-fill";

            progressFill.style.width = progress.toFixed(2) + "%";

            progressBar.appendChild(progressFill);
            card.appendChild(progressBar);

            addDetail(
                card,
                "Funding Progress",
                progress.toFixed(1) + "%"
            );

            addDetail(
                card,
                "Your Contribution",
                contributionETH + " ETH"
            );

            // ACTIONS CONTAINER

            const actions = document.createElement("div");
            actions.className = "campaign-actions";

            const actionMessage = document.createElement("p");
            actionMessage.className = "campaign-action-status";

            actions.appendChild(actionMessage);

            // ACTIVE CAMPAIGN

            if (campaignStatus === 0) {

                if (canFinalize) {

                    let finalizeButton;

                    finalizeButton = createButton(
                        "Finalize Campaign",
                        () => finalizeCampaign(
                            i,
                            actionMessage,
                            finalizeButton
                        )
                    );

                    actions.appendChild(finalizeButton);

                } else {

                    const contributeBox =
                        document.createElement("div");

                    contributeBox.className = "contribute-box";

                    const amountInput =
                        document.createElement("input");

                    amountInput.type = "number";
                    amountInput.min = "0.000000000000000001";
                    amountInput.step = "any";
                    amountInput.placeholder = "Amount in ETH";
                    amountInput.className = "contribution-amount";

                    const contributeButton = createButton(
                        "Contribute",
                        () => contributeToCampaign(
                            i,
                            amountInput.value,
                            actionMessage,
                            contributeButton
                        )
                    );

                    contributeButton.className = "contribute-button";

                    contributeBox.appendChild(amountInput);
                    contributeBox.appendChild(contributeButton);

                    actions.appendChild(contributeBox);
                }
            }

            // SUCCESSFUL CAMPAIGN

            else if (campaignStatus === 1) {

                if (isCreator && !withdrawn) {

                    let withdrawButton;

                    withdrawButton = createButton(
                        "Withdraw Funds",
                        () => withdrawFunds(
                            i,
                            actionMessage,
                            withdrawButton
                        )
                    );

                    actions.appendChild(withdrawButton);

                } else if (isCreator && withdrawn) {

                    actionMessage.textContent =
                        "Funds have already been withdrawn.";

                } else {

                    actionMessage.textContent =
                        "Campaign successful. Only the creator can withdraw.";
                }
            }

            // FAILED CAMPAIGN

            else if (campaignStatus === 2) {

                if (userContribution > 0n) {

                    let refundButton;

                    refundButton = createButton(
                        "Claim Refund",
                        () => claimRefund(
                            i,
                            actionMessage,
                            refundButton
                        )
                    );

                    actions.appendChild(refundButton);

                } else {

                    actionMessage.textContent =
                        "No refundable contribution from this wallet.";
                }
            }

            // VIEW DETAILS BUTTON

            const detailsButton = createButton(
                "View Details",
                () => showCampaignDetails(i)
            );

            detailsButton.className = "details-button";

            actions.appendChild(detailsButton);

            card.appendChild(actions);

            container.appendChild(card);
        }

        updateStatistics(
            Number(count),
            totalRaisedAll,
            activeCount,
            successfulCount,
            failedCount
        );

        applyCampaignFilters();

    } catch (error) {

        console.error(error);

        container.textContent =
            "Could not load campaigns: " + showError(error);
    }
}


// ================= CONTRIBUTE =================

async function contributeToCampaign(
    campaignId,
    amount,
    message,
    button
) {

    try {

        if (!contract) {
            throw new Error("Connect your wallet first.");
        }

        if (!amount || !amount.trim()) {
            throw new Error("Enter a contribution amount.");
        }

        const value = ethers.parseEther(amount.trim());

        if (value <= 0n) {
            throw new Error("Amount must be greater than zero.");
        }

        const campaign = await contract.campaigns(campaignId);

        const latestBlock = await provider.getBlock("latest");

        const chainTime = Number(latestBlock.timestamp);

        if (Number(campaign[5]) !== 0) {
            throw new Error("Campaign is not active.");
        }

        if (chainTime >= Number(campaign[3])) {
            throw new Error("Campaign deadline has passed.");
        }

        if (campaign[4] >= campaign[2]) {
            throw new Error("Funding goal already reached.");
        }

        button.disabled = true;

        message.textContent =
            "Confirm contribution in MetaMask...";

        const tx = await contract.contribute(
            campaignId,
            { value: value }
        );

        message.textContent = "Waiting for confirmation...";

        await tx.wait();

        updateText(
            "walletStatus",
            "Contribution completed successfully!"
        );

        await loadCampaigns();

    } catch (error) {

        message.textContent = "Error: " + showError(error);

        button.disabled = false;
    }
}


// ================= FINALIZE CAMPAIGN =================

async function finalizeCampaign(
    campaignId,
    message,
    button
) {

    try {

        if (!contract) {
            throw new Error("Connect your wallet first.");
        }

        button.disabled = true;

        message.textContent =
            "Confirm finalization in MetaMask...";

        const tx = await contract.finalizeCampaign(campaignId);

        message.textContent = "Waiting for confirmation...";

        await tx.wait();

        updateText(
            "walletStatus",
            "Campaign finalized successfully!"
        );

        await loadCampaigns();

    } catch (error) {

        message.textContent = "Error: " + showError(error);

        button.disabled = false;
    }
}


// ================= WITHDRAW FUNDS =================

async function withdrawFunds(
    campaignId,
    message,
    button
) {

    try {

        if (!contract) {
            throw new Error("Connect your wallet first.");
        }

        button.disabled = true;

        message.textContent =
            "Confirm withdrawal in MetaMask...";

        const tx = await contract.withdrawFunds(campaignId);

        message.textContent =
            "Waiting for withdrawal confirmation...";

        await tx.wait();

        updateText(
            "walletStatus",
            "Funds withdrawn successfully!"
        );

        await loadCampaigns();

    } catch (error) {

        message.textContent = "Error: " + showError(error);

        button.disabled = false;
    }
}


// ================= CLAIM REFUND =================

async function claimRefund(
    campaignId,
    message,
    button
) {

    try {

        if (!contract) {
            throw new Error("Connect your wallet first.");
        }

        button.disabled = true;

        message.textContent =
            "Confirm refund in MetaMask...";

        const tx = await contract.claimRefund(campaignId);

        message.textContent =
            "Waiting for refund confirmation...";

        await tx.wait();

        updateText(
            "walletStatus",
            "Refund claimed successfully!"
        );

        await loadCampaigns();

    } catch (error) {

        message.textContent = "Error: " + showError(error);

        button.disabled = false;
    }
}


// ================= SEARCH AND FILTER =================

function applyCampaignFilters() {

    const container =
        document.getElementById("campaignsContainer");

    const searchInput =
        document.getElementById("campaignSearch");

    const filterSelect =
        document.getElementById("campaignFilter");

    if (!container || !searchInput || !filterSelect) {
        return;
    }

    const search = searchInput.value.trim().toLowerCase();

    const filter = filterSelect.value;

    const cards = container.querySelectorAll(".campaign-card");

    let visibleCount = 0;

    container.querySelector(".no-results")?.remove();

    cards.forEach(card => {

        const title = card.dataset.title || "";
        const creator = card.dataset.creator || "";
        const status = card.dataset.status || "";

        const isCreator = card.dataset.isCreator === "true";

        const hasContribution =
            card.dataset.hasContribution === "true";

        const matchesSearch =
            title.includes(search) ||
            creator.includes(search);

        let matchesFilter = true;

        switch (filter) {

            case "active":
                matchesFilter = status === "active";
                break;

            case "successful":
                matchesFilter = status === "successful";
                break;

            case "failed":
                matchesFilter = status === "failed";
                break;

            case "mine":
                matchesFilter = isCreator;
                break;

            case "contributed":
                matchesFilter = hasContribution;
                break;

            default:
                matchesFilter = true;
        }

        const visible = matchesSearch && matchesFilter;

        card.style.display = visible ? "" : "none";

        if (visible) visibleCount++;
    });

    if (cards.length > 0 && visibleCount === 0) {

        const message = document.createElement("p");

        message.className = "no-results";

        message.textContent =
            "No campaigns match your search or filter.";

        container.appendChild(message);
    }
}


// ================= CAMPAIGN DETAILS =================

async function showCampaignDetails(campaignId) {

    try {

        if (!contract) {
            throw new Error("Connect your wallet first.");
        }

        const campaign = await contract.campaigns(campaignId);

        const creator = campaign[0];
        const title = campaign[1];
        const goal = campaign[2];
        const deadline = Number(campaign[3]);
        const raised = campaign[4];
        const status = Number(campaign[5]);
        const withdrawn = campaign[6];

        const contribution = await contract.contributions(
            campaignId,
            currentAccount
        );

        const goalETH = Number(ethers.formatEther(goal));
        const raisedETH = Number(ethers.formatEther(raised));

        const contributionETH =
            Number(ethers.formatEther(contribution));

        const progress = goalETH > 0
            ? Math.min(100, raisedETH / goalETH * 100)
            : 0;

        const statuses = [
            "Active",
            "Successful",
            "Failed"
        ];

        const content = document.getElementById(
            "campaignDetailsContent"
        );

        const dialog = document.getElementById(
            "campaignDetailsDialog"
        );

        updateText("detailsTitle", title);

        content.innerHTML = "";

        addDetail(content, "Campaign ID", campaignId);
        addDetail(content, "Creator", creator);
        addDetail(content, "Funding Goal", goalETH + " ETH");
        addDetail(content, "Total Raised", raisedETH + " ETH");

        addDetail(
            content,
            "Your Contribution",
            contributionETH + " ETH"
        );

        addDetail(
            content,
            "Deadline",
            new Date(deadline * 1000).toLocaleString()
        );

        addDetail(
            content,
            "Status",
            statuses[status] || "Unknown"
        );

        addDetail(
            content,
            "Funding Progress",
            progress.toFixed(1) + "%"
        );

        addDetail(
            content,
            "Funds Withdrawn",
            withdrawn ? "Yes" : "No"
        );

        dialog.showModal();

    } catch (error) {

        alert(showError(error));
    }
}


// ================= WALLET EVENTS =================

if (window.ethereum) {

    window.ethereum.on("accountsChanged", async function(accounts) {

        if (accounts.length === 0) {

            provider = null;
            signer = null;
            contract = null;
            currentAccount = null;

            updateText("walletStatus", "Wallet disconnected.");
            updateText("networkStatus", "Network: Not Connected");
            updateText("accountStatus", "Account: Not Connected");
            updateText("connectWallet", "Connect Wallet");

            resetStatistics();

            await loadCampaigns();

            return;
        }

        try {

            await initializeWallet(accounts[0]);

        } catch (error) {

            console.error(error);

            updateText(
                "walletStatus",
                "Please reconnect your wallet."
            );
        }
    });

    window.ethereum.on("chainChanged", function() {
        window.location.reload();
    });
}


// ================= EVENT LISTENERS =================

document
    .getElementById("connectWallet")
    .addEventListener("click", connectWallet);

document
    .getElementById("createCampaignForm")
    .addEventListener("submit", createCampaign);

document
    .getElementById("refreshCampaigns")
    .addEventListener("click", loadCampaigns);

document
    .getElementById("campaignSearch")
    .addEventListener("input", applyCampaignFilters);

document
    .getElementById("campaignFilter")
    .addEventListener("change", applyCampaignFilters);

document
    .getElementById("closeCampaignDetails")
    .addEventListener("click", function() {

        document
            .getElementById("campaignDetailsDialog")
            .close();
    });


// ================= END OF APPLICATION =================
