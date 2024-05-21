const loginEndpoint = 'https://sliver-stream.onrender.com';
const username = localStorage.getItem("username");

    fetch(`${loginEndpoint}/user/${username}`) // Replace URL with your API endpoint
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      //return response.json();
      return response.json();

    })
    .then(data => {
      // Once data is fetched, handle and display it
      displayUserData(data);
      console.log("log is",data)

    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
    function displayUserData(res) {
      if (username) {
        const data = JSON.parse(res.data)
        document.getElementById("user").innerText = data.username;
        document.getElementById("email").innerText = data.email;
        document.getElementById("mobile").innerText = data.mobile;
        document.getElementById("country").innerText = data.country;
        document.getElementById("acc").innerText = data.account;
      } else {
        // Redirect to the login.html page if the user is not logged in
        window.location.href = "login.html";
      }
    }
