document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    
    loginForm.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const formData = new FormData(loginForm);
      const email = formData.get("email");
      const password = formData.get("password");
  
      try {
        const response = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          alert("Login successful");
        } else {
          alert("Wrong username and password");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
  