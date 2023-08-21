document.addEventListener("DOMContentLoaded", function () {
  const leaderboardTable = document.getElementById("leaderboard_list");
  const hamburgerIcon = document.querySelector(".hamburger-menu");
  const navbarLinks = document.querySelector(".navbar-links");
  const logoutButton = document.getElementById("logoutLink");

  hamburgerIcon.addEventListener("click", function () {
    navbarLinks.classList.toggle("active");
  });

  async function fetchLeaderboardData() {
    try {
      const token = getCookie('token');
      const response = await axios.get("/leaderboard/showleaderboard", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const leaderboardData = response.data;
      console.log("Leaderboard Data: ", leaderboardData);

      leaderboardTable.querySelector("tbody").innerHTML = "";

      leaderboardData.forEach((entry) => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        const expensesCell = document.createElement("td");

        nameCell.textContent = entry.name;
        expensesCell.textContent = "₹ " + entry.totalExpense.toFixed(2);

        row.appendChild(nameCell);
        row.appendChild(expensesCell);

        leaderboardTable.querySelector("tbody").appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
    }
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  fetchLeaderboardData();

  logoutButton.addEventListener("click", async () => {
    try {
      const token = getCookie('token');
      if (token) {
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        window.location.href = '/login.html';
      }
    } catch (error) {
      console.error(error);
    }
  });

});
