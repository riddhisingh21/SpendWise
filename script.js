const balance = document.getElementById('balance');
const add_amt = document.getElementById('add_amt');
const sub_amt = document.getElementById('sub_amt');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const month = document.getElementById('month');
const filterBtn = document.getElementById('filter-btn');
const totalSavings = document.getElementById('total-savings');
const noTransactionsMessage = document.getElementById('no-transactions-message');

let transactions = [];
let chart = null;

function initChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Expenses',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function updateChart() {
    const labels = transactions.map(transaction => transaction.text);
    const data = transactions.map(transaction => Math.abs(transaction.amount));
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}

function addTransaction(transaction) {
    transactions.push(transaction);
    addTransactionToList(transaction);
    updateValues();
    updateSavings();
    updateChart();
}

function addTransactionToList(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `${transaction.text} <span>${sign}₹${Math.abs(transaction.amount).toFixed(2)}</span>`;
    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);
    balance.innerText = `₹${total}`;
    add_amt.innerText = `+₹${income}`;
    sub_amt.innerText = `-₹${expense}`;
}

function updateSavings() {
    const income = transactions.filter(transaction => transaction.amount > 0).reduce((acc, item) => (acc += item.amount), 0).toFixed(2);
    const expense = transactions.filter(transaction => transaction.amount < 0).reduce((acc, item) => (acc += Math.abs(item.amount)), 0).toFixed(2);
    const savings = (income - expense).toFixed(2);
    totalSavings.innerText = `₹${savings}`;
}

filterBtn.addEventListener('click', function() {
    const selectedMonth = month.value;
    if (selectedMonth) {
        const [year, month] = selectedMonth.split('-');
        const filteredTransactions = transactions.filter(transaction => {
            const transactionDate = new Date(transaction.date);
            return transactionDate.getFullYear() === parseInt(year) && transactionDate.getMonth() + 1 === parseInt(month);
        });

        list.innerHTML = '';
        if (filteredTransactions.length > 0) {
            filteredTransactions.forEach(addTransactionToList);
            noTransactionsMessage.style.display = 'none';
        } else {
            noTransactionsMessage.style.display = 'block';
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    initChart();
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (text.value && amount.value) {
        const transaction = {
            id: Math.floor(Math.random() * 100000),
            text: text.value,
            amount: +amount.value,
            date: new Date(),
        };
        addTransaction(transaction);
        text.value = '';
        amount.value = '';
    } else {
        alert('Please fill in both fields.');
    }
});

const todoForm = document.getElementById('todo-form');
const todoTextInput = document.getElementById('todo-text');
const todoAmountInput = document.getElementById('todo-amount');
const todoList = document.getElementById('to_list');

let todoItems = [];

todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const todoText = todoTextInput.value;
    const todoAmount = parseFloat(todoAmountInput.value);
    if (todoText && !isNaN(todoAmount)) {
        const todoItem = {
            id: Date.now(),
            text: todoText,
            amount: todoAmount,
            paid: false
        };
        todoItems.push(todoItem);
        addTodoItemToList(todoItem);
        todoTextInput.value = '';
        todoAmountInput.value = '';
    } else {
        alert('Please fill in both fields.');
    }
});

function addTodoItemToList(todoItem) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    if (todoItem.paid) {
        li.classList.add('paid');
    }
    li.innerHTML = `
        ${todoItem.paid ? '✔️ ' : ''}${todoItem.text} <span>Amount Due: ₹${todoItem.amount.toFixed(2)}</span>
        ${!todoItem.paid ? `<button class="remainder-btn" onclick="markAsPaid(${todoItem.id})">Mark as Paid</button>` : ''}
    `;
    todoList.appendChild(li);
}

window.markAsPaid = function(id) {
    const paidItem = todoItems.find(item => item.id === id);
    if (paidItem && !paidItem.paid) {
        todoItems = todoItems.map(item =>
            item.id === id ? { ...item, paid: true } : item
        );

        const paymentTransaction = {
            id: Math.floor(Math.random() * 100000),
            text: `Paid for: ${paidItem.text}`,
            amount: -paidItem.amount,
            date: new Date(),
        };
        addTransaction(paymentTransaction);
        updateTodoList();
    }
};

function updateTodoList() {
    todoList.innerHTML = '';
    todoItems.forEach(addTodoItemToList);
}

