const buyPremiumButton = document.getElementById('buyPremium');

buyPremiumButton.addEventListener('click', async () => {
  try {
    const token = getCookie('token');
    
    if (!token) {
     
      alert('Please log in to buy premium membership.');
      window.location.href = '/login.html'; 
      return;
    }

    const response = await axios.post('/buyPremium', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const paymentLink = response.data.paymentLink;

    window.open(paymentLink, '');

    alert('Please complete the payment to become a premium member.');
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred.');
  }
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
