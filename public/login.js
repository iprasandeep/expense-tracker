document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");
  const messageElement = document.getElementById("message");
  
  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(loginForm);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await axios.post("/login", { email, password });

      if (response.data.success) {
        messageElement.textContent = "Login successful"; 
        messageElement.style.color = "green";
      } else {
        messageElement.textContent = response.data.message; 
        messageElement.style.color = "red";
      }
    } catch (error) {
      console.error("Error:", error);
      messageElement.style.color = "red";
      messageElement.textContent = "An error occurred";
      
    }
  });
});
