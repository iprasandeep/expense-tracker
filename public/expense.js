const expenseForm = document.getElementById('expense-form');

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await axios.get('/expenses');
        const expenses = response.data;
        expenses.forEach(expense => {
            displayExpense(expense);
        });
    } catch (error) {
        console.error(error);
    }
    expenseForm.addEventListener('submit', addExpense);
});

async function addExpense(event) {
    event.preventDefault();

    const amount = parseFloat(document.getElementById("amount").value);
    const details = document.getElementById("details").value;
    const category = document.getElementById("category").value;

    const expenseData = { amount, details, category };

    try {
        const response = await axios.post('/addExpense', expenseData);
        displayExpense(response.data.expense);
        expenseForm.reset();
    } catch (error) {
        console.error('Error adding expense:', error);
    }
}

function displayExpense(expense) {
    const expenseList = document.getElementById("expense-list");

    const expenseItem = document.createElement("div");
    expenseItem.classList.add("expense-item");
    expenseItem.setAttribute("data-id", expense.id); 
    expenseItem.innerHTML = `
        <p><strong>Amount:</strong> ${expense.amount}</p>
        <p><strong>Details:</strong> ${expense.details}</p>
        <p><strong>Category:</strong> ${expense.category}</p>
        <button class="delete-button" onclick="deleteExpense('${expense.id}')">Delete Expense</button>
    `;

    expenseList.appendChild(expenseItem);
}

async function deleteExpense(expenseId) {
    try {
        await axios.post('/deleteExpense', { id: expenseId });
        const expenseItem = document.querySelector(`[data-id='${expenseId}']`);
        if (expenseItem) {
            expenseItem.remove();
        }
    } catch (error) {
        console.error('Error deleting expense:', error);
    }
}
