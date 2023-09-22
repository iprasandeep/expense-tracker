document.addEventListener("DOMContentLoaded", () => {
  const expenseList = document.getElementById("expense-list");
  const totalExpenseAmount = document.getElementById("total-expense-amount");

  const token = getCookie("token");
  let expenses;

  axios
    .get("/expense/expenses", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      expenses = response.data.expenses;
      console.log(expenses);

      expenses.forEach((expense) => {
        const row = document.createElement("tr");

        const formattedDate = new Date(expense.createdAt).toLocaleDateString();
        const category = expense.category;
        const description = expense.details;

        row.innerHTML = `
          <td>${formattedDate}</td>
          <td class="cat">${category}</td>
          <td>${description}</td>
          <td>₹${expense.amount.toFixed(2)}</td>
        `;
        expenseList.appendChild(row);
      });

      const totalExpense = expenses.reduce((acc, expense) => acc + expense.amount, 0);
      totalExpenseAmount.textContent = `₹${totalExpense.toFixed(2)}`;
    })
    .catch((error) => {
      console.error("Error fetching expenses:", error);
    });

const downloadReportsButton = document.getElementById("generatePdfButton");

downloadReportsButton.addEventListener("click", () => {

  if (expenses) {
    const token = getCookie("token");
    axios
      .post(
        "/generate-expense-report",
        { expenses },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const s3Url = response.data.s3Url;
        window.open(s3Url, '_blank');
      })
      .catch((error) => {
        console.error("Error downloading all reports:", error);
      });
  } else {
    console.error("Expenses data is not available.");
  }
});
    
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
