// script.js

// Get elements
const transactionForm = document.getElementById("transactionForm");
const transactionName = document.getElementById("transactionName");
const transactionAmount = document.getElementById("transactionAmount");
const transactionType = document.getElementById("transactionType");
const transactionList = document.getElementById("transactionList");
const balanceDisplay = document.getElementById("balance");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateBalance() {
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expense;
    balanceDisplay.textContent = balance.toFixed(2);
}

function renderTransactions() {
    transactionList.innerHTML = "";
    transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.classList.add("transaction-item", transaction.type);

        li.innerHTML = `
            ${transaction.name}: $${transaction.amount.toFixed(2)}
            <button class="delete-btn" onclick="deleteTransaction(${index})">x</button>
        `;

        transactionList.appendChild(li);
    });
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateLocalStorage();
    renderTransactions();
    updateBalance();
}

transactionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = transactionName.value.trim();
    const amount = parseFloat(transactionAmount.value);
    const type = transactionType.value;

    if (!name || isNaN(amount) || amount <= 0) {
        alert("Please enter valid name and amount.");
        return;
    }

    const newTransaction = {
        name,
        amount: Math.abs(amount),
        type,
    };

    transactions.push(newTransaction);
    updateLocalStorage();
    renderTransactions();
    updateBalance();

    transactionForm.reset();
});

// Initial load
renderTransactions();
updateBalance();
