const login_btn = document.getElementById('login_btn');

document.getElementById('login').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    iziToast.info({
      title: 'Info',
      message: 'Wait while you are logged in',
      position: 'topRight'
    })
    // Get form data
    const formData = new FormData(this);

    login_btn.disabled = true;

    // Simulated endpoint for login (replace this with your actual endpoint)
    const loginEndpoint = 'https://sliver-stream.onrender.com';
    console.log(formData.get('username'))
   
    
    // Simulated login request
    fetch(`${loginEndpoint}/login`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({'username': formData.get('username'), 'password': formData.get('pass')})
    })
    .then(response => {
      if (!response.ok) {
        iziToast.error({
          title: 'Error',
          message: 'Wrong email or password',
          position: 'topRight'
        })
        login_btn.disabled = false;

        throw new Error('Login failed.');
      }
      return response.json();
    })
    .then(data => {
      // Simulated successful login
      console.log('Login successful:', data);
      // Store the authentication status in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", formData.get('username'));

  
      // Redirect to the dashboard upon successful login
      window.location.href = 'dashboard.html';
    })
    .catch(error => {
      // Handle login errors
      // iziToast.error({
      //   title: 'Error',
      //   message: 'Wrong email or password',
      //   position: 'topRight'
      //   // You can customize other properties of the notification as needed

      // });
      console.error('Login failed:', error);
      // You can show an error message or perform other actions here
    });
  });