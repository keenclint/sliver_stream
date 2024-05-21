
//+++++++++++++++++++++++++++++++++++++++ REGISTER USER ++++++++++++++++++++++++++++++++++++++++++++++++++++++

const register_btn = document.getElementById('create');

document.getElementById('register').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    iziToast.info({
      title: 'Info',
      message: 'Please wait while an account is being created for you',
      position: 'topRight'
    })
    // Get form data
    const formData = new FormData(this);

    register_btn.disabled = true;

    // Simulated endpoint for login (replace this with your actual endpoint)
    const loginEndpoint = 'http://127.0.0.1:8000';
    console.log(JSON.stringify({
      'username': formData.get('username'), 
      'password': formData.get('password'),
      "email": formData.get("email"),
      "address": formData.get("address"),
      "cell": `${formData.get("country")}-${formData.get("mobile")}`,
      "first_name": formData.get('first'),
      "last_name": formData.get('last'),
      "madien_name": formData.get('madien'),
    }))
   
    
    // Simulated login request
    fetch(`${loginEndpoint}/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        'username': formData.get('username'), 
        'password': formData.get('password'),
        "email": formData.get("email"),
        "address": formData.get("address"),
        "country": formData.get("country"),
        "mobile": formData.get('mobile'),
        "first_name": formData.get('first'),
        "last_name": formData.get('last'),
        "madien_name": formData.get('madien'),
      })
    })
    .then(response => {
      if (!response.ok) {
        iziToast.error({
          title: 'Error',
          message: 'Something went wrong, please try again',
          position: 'topRight'
        })
        login_btn.disabled = false;

        throw new Error('Signup failed.');
      }
      return response.json();
    })
    .then(data => {
      // Simulated successful login
      console.log('Login successful:', data);
      // Store the authentication status in localStorage
      localStorage.setItem("hasRegistered", "true");
      localStorage.setItem("username", formData.get('username'));

        // Redirect to the dashboard upon successful login
      window.location.href = 'login.html';
    })

  });
  


