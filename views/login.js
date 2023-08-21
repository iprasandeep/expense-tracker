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
      console.log("Resposne Data: ", response);
      if (response.data.success) {
        messageElement.textContent = "Login successful"; 
        messageElement.style.color = "green";
        const token = response.data.token; 
        document.cookie = `token=${token}; expires=; path=/`;
        
        localStorage.setItem("token", response.data.token);
        // set userId in localStorage
        window.location.href = "/expense.html";
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1000); // Delay in milliseconds
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
