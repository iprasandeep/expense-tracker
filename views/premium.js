const premiumButton = document.getElementById("premium");
const reportLink = document.getElementById("reports");
const reportIcon = reportLink.querySelector('.fa');
const leaderboardLink = document.getElementById("leaderboard");
const leaderboardIcon = leaderboardLink.querySelector('.fa');
const purchaseIcon = premiumButton.querySelector(".fa");

function updateReportsAccess(isPremiumUser) {
  if (isPremiumUser) {
    reportIcon.style.display = "none";
    // reportLink.style.color = "green"; 
  } else {
    reportLink.removeAttribute("href");
    reportLink.title = "Buy Premium to Access";
    reportLink.style.cursor = "pointer";
  }
}

function updateLeaderboardAccess(isPremiumUser) {
  if (isPremiumUser) {
    leaderboardIcon.style.display = "none";
  } else {
    leaderboardLink.removeAttribute("href");
    leaderboardLink.title = "Buy Premium to Access";
    leaderboardLink.style.cursor = "pointer";
  }
}

function updatePremiumButton(isPremiumUser) {
  if (isPremiumUser) {
    premiumButton.textContent = "Premium Member";
    premiumButton.style.color = "green";
    premiumButton.disabled = true;
    purchaseIcon.style.display = "none";
  } else {
    premiumButton.onclick = async (e) => {
      try {
        const token = getCookie('token');
        const response = await axios.get("/purchase/buypremium", { headers: { Authorization: `Bearer ${token}` } });
        console.log("Razorpay Response:", response.data);
        const options = {
          'key': response.data.key_id,
          "order_id": response.data.order.id,
          "handler": async function (response) {
            try {
              const result = await axios.post("/purchase/updatestatus", {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
              }, { headers: { Authorization: `Bearer ${token}` } });

              localStorage.setItem("token", result.data.token);
              premium_success();
            } catch (error) {
              console.error("Error updating payment status:", error);
            }
          },
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on("payment.failed", async () => {
          try {
            const key = response.data.order.id;
            const failed = await axios.post("/purchase/updatestatus", {
              order_id: key,
              payment_id: null
            }, { headers: { Authorization: `Bearer ${token}` } });
            alert(failed.data.message);
          } catch (error) {
            console.error("Error in payment fail section", error);
          }
        });

      } catch (error) {
        console.error("Error in frontend of razorpay", error);
      }
    };
  }
}

function premium_success() {
  alert("You're a premium member now!");
  premiumButton.textContent = "Premium Member";
  premiumButton.style.color = "green";
  premiumButton.disabled = true;
  purchaseIcon.style.display = "none";
  reportIcon.style.display = "none";
  leaderboardIcon.style.display = "none";
}

document.addEventListener("DOMContentLoaded", async function () {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const token = getCookie('token');

  try {
    const response = await axios.get("/checkstatus/memebrshipstatus", { headers: { Authorization: `Bearer ${token}` } });
    const isPremiumUser = response.data.premiumUser;
    updatePremiumButton(isPremiumUser);
    updateReportsAccess(isPremiumUser);
    updateLeaderboardAccess(isPremiumUser);
  } catch (error) {
    console.error("Error fetching user premium status:", error);
  }
});
