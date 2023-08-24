document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const messageDiv = document.getElementById("message");
    const loginLink = document.querySelector(".check-user-exist");
  
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
  
      const email = loginForm.email.value;
  
      try {
        // const token = getCookie('token'); // Retrieve the token correctly
        const response = await axios.post(
          "/password/forgotpassword",
          { email },
  
        );
  
        if (response.data.success) {
          messageDiv.textContent = "Password reset email sent successfully.";
          messageDiv.style.color = "green";
          loginLink.style.display = "block";
        } else {
          messageDiv.textContent = "Error sending password reset email.";
          messageDiv.style.color = "red";
          loginLink.style.display = "none";
        }
      } catch (error) {
        console.error("Error sending password reset email:", error);
        messageDiv.textContent = "An error occurred. Please try again later.";
        messageDiv.style.color = "red";
        loginLink.style.display = "none";
      }
    });
 
  });
  