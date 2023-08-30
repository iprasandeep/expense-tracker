const expenseForm = document.getElementById('expense-form');
const hamburgerIcon = document.querySelector(".hamburger-menu");
const navbarLinks = document.querySelector(".navbar-links");
const logoutLink = document.getElementById('logoutLink');

hamburgerIcon.addEventListener("click", function () {
  navbarLinks.classList.toggle("active");
});

// logout 
async function logout(e) {
  e.preventDefault()
  try {
    const token = getCookie('token');
    if (token) {
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      window.location.href = '/login.html';
    }
  } catch (error) {
    console.error(error);
  }
}
// pagination logic
let currentPage = 1;
const expensesPerPage = 5;
let expenses = [];

function displayExpensesForPage(page) {
  const expenseList = document.querySelector("#expense-list tbody");
  expenseList.innerHTML = "";

  const startIndex = (page - 1) * expensesPerPage;
  const endIndex = startIndex + expensesPerPage;

  for (let i = startIndex; i < endIndex && i < expenses.length; i++) {
    displayExpense(expenses[i]);
  }
}

function updatePagination() {
  const prevButton = document.getElementById("prev-page");
  const nextButton = document.getElementById("next-page");
  const pageInfo = document.getElementById("page-info");

  pageInfo.textContent = `Page ${currentPage}`;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === Math.ceil(expenses.length / expensesPerPage);
}

function nextPage() {
  if (currentPage < Math.ceil(expenses.length / expensesPerPage)) {
    currentPage++;
    displayExpensesForPage(currentPage);
    updatePagination();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    displayExpensesForPage(currentPage);
    updatePagination();
  }
}

//

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = getCookie('token');
    if (token) {
      const response = await axios.get('/expense/expenses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      expenses = response.data;

      displayExpensesForPage(currentPage);
      updatePagination();
    }
  } catch (error) {
    console.error(error);
  }

  expenseForm.addEventListener('submit', addExpense);

  // paginaton event listeners
  document.getElementById("next-page").addEventListener("click", nextPage);
  document.getElementById("prev-page").addEventListener("click", prevPage);
});

async function addExpense(event) {
  event.preventDefault();

  const amount = parseFloat(document.getElementById("amount").value);
  const details = document.getElementById("details").value;
  const category = document.getElementById("category").value;

  const expenseData = { amount, details, category };
  const token = getCookie('token');

  try {
    const response = await axios.post('/expense/addExpense', expenseData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    expenses.unshift(response.data.expense);

    currentPage = 1;
    displayExpensesForPage(currentPage);
    updatePagination();
    
    expenseForm.reset();
  } catch (error) {
    console.error('Error adding expense:', error);
  }
}
  

function displayExpense(expense) {
  const expenseList = document.querySelector("#expense-list tbody");

  const expenseRow = document.createElement("tr");
  expenseRow.classList.add("expense-item");
  expenseRow.setAttribute("data-id", expense.id);
  expenseRow.innerHTML = `
    <td><i class="fa fa-inr" aria-hidden="true"></i>&nbsp;${expense.amount}</td>
    <td>${expense.details}</td>
    <td class="categories">${expense.category}</td>
    <td><button class="delete-button" onclick="deleteExpense('${expense.id}')">Delete Expense</button></td>
  `;

  expenseList.appendChild(expenseRow);
}

async function deleteExpense(expenseId) {
  try {
    const token = getCookie('token');
    await axios.post('expense/deleteExpense', { id: expenseId }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const expenseItem = document.querySelector(`[data-id='${expenseId}']`);
    if (expenseItem) {
      expenseItem.remove();
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
  }
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

logoutLink.addEventListener('click', logout);
