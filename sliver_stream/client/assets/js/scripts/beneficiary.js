
//+++++++++++++++++++++++++++++++++++++++ REGISTER USER ++++++++++++++++++++++++++++++++++++++++++++++++++++++

const register_btn = document.getElementById('create');
const bene_list = document.getElementById("bene_list")
const bene_no_list = document.getElementById("bene_no_list")

const loginEndpoint = 'https://sliver-stream.onrender.com';
const username = localStorage.getItem("username");


document.getElementById('beneficiaries').addEventListener('submit', function(event) {
  console.log("in here")  
  event.preventDefault(); // Prevent the default form submission
    iziToast.info({
      title: 'Info',
      message: 'Please wait while an beneficiary is being added',
      position: 'topRight'
    })
    // Get form data
    const formData = new FormData(this);
    // Simulated endpoint for login (replace this with your actual endpoint)   
    

    register_btn.disabled = true;

    // Simulated login request
    fetch(`${loginEndpoint}/create_beneficiary`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        'username': username, 
        'account_name': formData.get('account_name'),
        "account_number": formData.get("account_number"),
        "short_name": formData.get("short_name"),
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
      window.location.href = "beneficiaries.html";

    })

  });
  
//=================================================================================================================================================================
//===================================================================== FETCH Credits ========================================================================
//=================================================================================================================================================================



fetch(`${loginEndpoint}/beneficiaries/${username}`) // Replace URL with your API endpoint
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  return response.json();
})
.then(data => {
  displayUserCredits(data);
  console.log("log is",data)

})
.catch(error => {
  console.error('There has been a problem with your fetch operation:', error);
});

function displayUserCredits(res) {
 
  bene_no_list.style.display = 'none';

  //const data = ['Info 1', 'Info 2', 'Info 3']; // Replace with your data

  const data = JSON.parse(res.data)

  data.forEach(item => {
    const tr = document.createElement('tr');
  
    //Creating table data cells and setting their attributes
    
    const td1 = document.createElement('td');
    // td1.setAttribute('colspan', '100%');
    // td1.classList.add('text-center');
    td1.textContent = item.account_number;

    const td2 = document.createElement('td');
    // td2.setAttribute('colspan', '100%');
    // td2.classList.add('text-center');
    td2.textContent = item.account_name;

    const td3 = document.createElement('td');
    // td3.setAttribute('colspan', '100%');
    // td3.classList.add('text-center');
    td3.textContent = item.short_name;
  
    // Appending table data cells to the table row
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
  
    // Appending the table row to the table (CreditdataList)
    bene_list.appendChild(tr);
  });

}

