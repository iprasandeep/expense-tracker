document.addEventListener("DOMContentLoaded", function () {
    const reportContainers = document.querySelectorAll(".report-table");
    
    const dummyData = [
      { date: "2023-April-01", category: "Groceries", income: "1000", expenses: "300" },
      { date: "2023-March-02", category: "Entertainment", income: "500", expenses: "200" },
    
    ];
  
    function generateTableRows(table, data) {
      const tbody = table.querySelector("tbody");
      tbody.innerHTML = "";
      
      data.forEach((entry) => {
        const row = document.createElement("tr");
        const dateCell = document.createElement("td");
        const categoryCell = document.createElement("td");
        const incomeCell = document.createElement("td");
        const expensesCell = document.createElement("td");
  
        dateCell.textContent = entry.date;
        categoryCell.textContent = entry.category;
        incomeCell.textContent = "₹ " + entry.income;
        expensesCell.textContent = "₹ " + entry.expenses;
  
        row.appendChild(dateCell);
        row.appendChild(categoryCell);
        row.appendChild(incomeCell);
        row.appendChild(expensesCell);
  
        tbody.appendChild(row);
      });
    }
  
    reportContainers.forEach((container) => {
      const table = container.querySelector(".report-table-details");
      generateTableRows(table, dummyData);
    });
  });
  