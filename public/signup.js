document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById("signup-form");
    
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const formData = new FormData(signupForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
  
      try {
        const response = await fetch("/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        });
  
        const data = await response.json();
  
        if (data.success) {
          alert("Sign up successful");
        } else {
          alert("User already exists");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  });
  