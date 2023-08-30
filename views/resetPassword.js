document.addEventListener('DOMContentLoaded', function () {
    const resetPasswordForm = document.getElementById('resetPasswordForm');
  
    resetPasswordForm.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const newPassword = resetPasswordForm.newPassword.value;
      console.log("New Password: ", newPassword);
      const requestId = window.location.pathname.split('/').pop();
  
      try {
        const response = await axios.put(`/reset-password/${requestId}`, { newPassword }); 
        if (response.data.message) {
          alert(response.data.message);
          window.location.href = '/login'; 
        }
      } catch (error) {
        console.error('Error resetting password:', error);
        alert('An error occurred while resetting the password');
      }
    });
  });
  