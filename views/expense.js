  const expenseForm = document.getElementById('expense-form');
  const hamburgerIcon = document.querySelector(".hamburger-menu");
  const navbarLinks = document.querySelector(".navbar-links");
  const logoutLink = document.getElementById('logoutLink');


  // default page set
  let currentPage = 1;
  let totalPages = 1;

  async function fetchAndDisplayExpenses(token, page, expensesPerPage) {
    try {
      const response = await axios.get(`/expense/expenses?page=${page}&limit=${expensesPerPage}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { expenses, totalCount } = response.data;

      totalPages = Math.ceil(totalCount / expensesPerPage);

      updatePaginationInfo();

      const expenseList = document.querySelector("#expense-list tbody");
      expenseList.innerHTML = "";

      expenses.forEach(expense => {
        displayExpense(expense);
      });
    } catch (error) {
      console.error(error);
    }
  }

  // navigation
  function navigatePage(direction) {
    currentPage += direction;


    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const token = getCookie('token');
    const expensesPerPageSelect = document.getElementById("expenses-per-page");
    fetchAndDisplayExpenses(token, currentPage, expensesPerPageSelect.value);
  }

  // updating expense according to page
  function updatePaginationInfo() {
    const pageInfo = document.getElementById("page-info");
    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    if (currentPage === 1) {
      prevPageButton.disabled = true;
    } else {
      prevPageButton.disabled = false;
    }

    if (currentPage === totalPages) {
      nextPageButton.disabled = true;
    } else {
      nextPageButton.disabled = false;
    }
  }

  // adding expenses
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
      displayExpense(response.data.expense);
      expenseForm.reset();

      const expensesPerPageSelect = document.getElementById("expenses-per-page");
      fetchAndDisplayExpenses(token, currentPage, expensesPerPageSelect.value);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  }

  // display details
  function displayExpense(expense) {
    const expenseList = document.querySelector("#expense-list tbody");

    const expenseRow = document.createElement("tr");
    expenseRow.classList.add("expense-item");
    expenseRow.setAttribute("data-id", expense.id);
    expenseRow.innerHTML = `
    <td><i class="fa fa-inr" aria-hidden="true"></i>&nbsp;${expense.amount}</td>
    <td>${expense.details}</td>
    <td class="categories">${expense.category}</td>
    <td><button class="delete-button" data-expense-id="${expense.id}">Delete Expense</button></td>
  `;

    expenseList.appendChild(expenseRow);
  }

  // delete
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

  //cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  //logout
  async function logout(e) {
    e.preventDefault();
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

  // pagination
  function configureExpensesPerPage() {

    const expensesPerPageSelect = document.getElementById("expenses-per-page");
    const storedExpensesPerPage = localStorage.getItem("expensesPerPage");
    if (storedExpensesPerPage) {
      expensesPerPageSelect.value = storedExpensesPerPage;
    }

    const token = getCookie('token');
    fetchAndDisplayExpenses(token, currentPage, expensesPerPageSelect.value);

    expensesPerPageSelect.addEventListener('change', () => {
      localStorage.setItem("expensesPerPage", expensesPerPageSelect.value);

      const token = getCookie('token');
      fetchAndDisplayExpenses(token, currentPage, expensesPerPageSelect.value);
    });
  }

  hamburgerIcon.addEventListener("click", function () {
    navbarLinks.classList.toggle("active");
  });

  logoutLink.addEventListener('click', logout);

  document.addEventListener("DOMContentLoaded", async () => {
    try {
      const token = getCookie('token');
      if (!token) {
        const popup = document.getElementById('popup');
        popup.style.display = 'block'; 
      } else {
        configureExpensesPerPage();
      }
    } catch (error) {
      console.error(error);
    }

    expenseForm.addEventListener('submit', addExpense);

    const prevPageButton = document.getElementById("prev-page");
    const nextPageButton = document.getElementById("next-page");
    prevPageButton.addEventListener('click', () => navigatePage(-1));
    nextPageButton.addEventListener('click', () => navigatePage(1));

    document.addEventListener('click', (event) => {
      if (event.target.classList.contains('delete-button')) {
        const expenseId = event.target.getAttribute('data-expense-id');
        deleteExpense(expenseId);
      }
    });
  });
