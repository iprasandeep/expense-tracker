document.addEventListener("DOMContentLoaded", function () {
    let signupForm = document.getElementById("signup-form");
    const messageElement = document.getElementById("message");
    
    signupForm.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const formData = new FormData(signupForm);
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");

      try {
        const response = await axios.post("/signup", { name, email, password });
  
        if (response.data.success) {
          messageElement.textContent = "Sign up successful"; 
          messageElement.style.color = "green";
        //   window.location.href = "/login.html";
        } else {
          messageElement.textContent = response.data.message;
          messageElement.style.color = "red";
        //   alert(response.data.message)
        }
      } catch (error) {
        console.error("Error:", error);
        messageElement.style.color = "red";
        messageElement.textContent = "An error occurred";
       
      }
    });
  });
  