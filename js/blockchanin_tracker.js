document.addEventListener('DOMContentLoaded', () => {
    const openViewerBtn = document.getElementById('openViewerBtn');
    const blockchainViewerPanel = document.getElementById('blockchainViewerPanel');
    const closeBtn = blockchainViewerPanel.querySelector('.close-btn');
    const ethAddressInput = document.getElementById('ethAddress');
    const fetchTransactionsBtn = document.getElementById('fetchTransactionsBtn');
    const loadingIndicator = document.getElementById('loading');
    const errorMessageDiv = document.getElementById('errorMessage');
    const transactionList = document.getElementById('transactionList');
    const simpleFlowList = document.getElementById('simpleFlowList');

    // --- Configuration ---
    // IMPORTANT: In a real application, NEVER expose your API key directly in client-side code.
    // Use a backend proxy to make API calls to Etherscan.
    const ETHERSCAN_API_KEY = 'YOUR_ETHERSCAN_API_KEY'; // <--- REPLACE WITH YOUR API KEY
    const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';

    // Function to open the popup
    openViewerBtn.addEventListener('click', () => {
        blockchainViewerPanel.classList.add('active');
        // Clear previous results when opening
        clearResults();
    });

    // Function to close the popup
    closeBtn.addEventListener('click', () => {
        blockchainViewerPanel.classList.remove('active');
    });

    // Close when clicking outside the panel content
    blockchainViewerPanel.addEventListener('click', (e) => {
        if (e.target === blockchainViewerPanel) {
            blockchainViewerPanel.classList.remove('active');
        }
    });

    // Function to clear previous results
    function clearResults() {
        transactionList.innerHTML = '';
        simpleFlowList.innerHTML = '';
        errorMessageDiv.classList.add('hidden');
        errorMessageDiv.textContent = '';
        loadingIndicator.classList.add('hidden');
    }

    // Function to fetch transactions
    fetchTransactionsBtn.addEventListener('click', async () => {
        const address = ethAddressInput.value.trim();
        clearResults();

        if (!address) {
            displayError('Please enter an Ethereum address.');
            return;
        }

        if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
            displayError('Invalid Ethereum address format.');
            return;
        }

        loadingIndicator.classList.remove('hidden');

        try {
            const response = await fetch(`${ETHERSCAN_API_URL}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`);
            const data = await response.json();

            loadingIndicator.classList.add('hidden');

            if (data.status === '1' && data.result.length > 0) {
                displayTransactions(address, data.result);
            } else if (data.status === '0' && data.message.includes('No transactions found')) {
                displayError('No transactions found for this address.');
            } else {
                displayError(`Error fetching transactions: ${data.message || 'Unknown error'}`);
                console.error('Etherscan API Error:', data);
            }
        } catch (error) {
            loadingIndicator.classList.add('hidden');
            displayError('Failed to fetch transactions. Check your network connection or API key.');
            console.error('Network or API error:', error);
        }
    });

    // Function to display transactions
    function displayTransactions(currentAddress, transactions) {
        // Limit to a reasonable number of transactions for display
        const recentTransactions = transactions.slice(0, 10); // Display top 10 recent transactions

        transactionList.innerHTML = '';
        simpleFlowList.innerHTML = '';

        const connectedAddresses = new Set();
        connectedAddresses.add(currentAddress.toLowerCase()); // Add the main address

        if (recentTransactions.length === 0) {
            transactionList.innerHTML = '<li>No recent transactions found.</li>';
            return;
        }

        recentTransactions.forEach(tx => {
            const isIncoming = tx.to.toLowerCase() === currentAddress.toLowerCase();
            const counterparty = isIncoming ? tx.from : tx.to;
            const amountEth = (parseFloat(tx.value) / 1e18).toFixed(6); // Convert Wei to Ether

            // Add counterparty to the set for simple flow visualization
            connectedAddresses.add(counterparty.toLowerCase());

            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${isIncoming ? 'Incoming' : 'Outgoing'} Transaction:</strong><br>
                Amount: ${amountEth} ETH<br>
                Counterparty: <span class="tx-id">${counterparty}</span><br>
                Tx ID: <span class="tx-id">${tx.hash.substring(0, 30)}...</span>
            `;
            transactionList.appendChild(listItem);
        });

        // Simple flow visualization (just a list of unique connected addresses)
        simpleFlowList.innerHTML = `<li><strong>Central Address:</strong> ${currentAddress}</li>`;
        connectedAddresses.forEach(addr => {
            if (addr !== currentAddress.toLowerCase()) {
                const flowItem = document.createElement('li');
                flowItem.innerHTML = `Connected to: <strong>${addr}</strong>`;
                simpleFlowList.appendChild(flowItem);
            }
        });
        if (connectedAddresses.size === 1) { // Only the current address
             simpleFlowList.innerHTML += '<li>No direct transaction partners found in recent transactions.</li>';
        }
    }

    // Function to display errors
    function displayError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.classList.remove('hidden');
    }
});