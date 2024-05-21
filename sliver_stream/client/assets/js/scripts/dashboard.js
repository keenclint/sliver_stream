const isLoggedIn = localStorage.getItem("isLoggedIn");
const username = localStorage.getItem("username");

const dataList = document.getElementById('debittxlist');
const noList= document.getElementById('debitnolist');

// credit htmls
const CreditdataList = document.getElementById('credittxlist');
const CreditnoList= document.getElementById('creditnolist');
let transactions = 0;

//dataList.style.display = 'none';
//noList.style.display = 'block';


const loginEndpoint = 'https://sliver-stream.onrender.com';

fetch(`${loginEndpoint}/dashboard/${username}`) // Replace URL with your API endpoint
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
  if (isLoggedIn === "true" && username) {
    const data = JSON.parse(res.data)
    document.getElementById("acc-num").innerText = data.account;
    document.getElementById("balance").innerText = `$${data.balance.toLocaleString()}.00`;
    document.getElementById("deposits").innerText = `$${data.deposits.toLocaleString()}.00`;
    document.getElementById("withdrawals").innerText = `$${data.withdrawals.toLocaleString()}.00`;
    //document.getElementById("transactions").innerText = transactions;
    // document.getElementById("idr").innerText = res.idr;
    // document.getElementById("dps").innerText = res.dps;
    // document.getElementById("loans").innerText = res.loans;    
  } else {
    // Redirect to the login.html page if the user is not logged in
    window.location.href = "login.html";
  }

}

//=================================================================================================================================================================
//===================================================================== FETCH Credits ========================================================================
//=================================================================================================================================================================



fetch(`${loginEndpoint}/credits/${username}`) // Replace URL with your API endpoint
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
 
  CreditnoList.style.display = 'none';

  //const data = ['Info 1', 'Info 2', 'Info 3']; // Replace with your data

  const data = JSON.parse(res.data)

  transactions = transactions + data.length

  
  data.forEach(item => {
    const tr = document.createElement('tr');
  
    //Creating table data cells and setting their attributes
    const td1 = document.createElement('td');
    td1.setAttribute('colspan', '100%');
    td1.classList.add('text-center');
    td1.textContent = item.sn;
  
    const td2 = document.createElement('td');
    td2.setAttribute('colspan', '100%');
    td2.classList.add('text-center');
    td2.textContent = item.tx;
  
    const td3 = document.createElement('td');
    td3.setAttribute('colspan', '100%');
    td3.classList.add('text-center');
    td3.textContent = `Received $${item.amount} from ${item.tx} with ref.no ${item.sn}`;
  
    // Appending table data cells to the table row
    //tr.appendChild(td1);
    //tr.appendChild(td2);
    tr.appendChild(td3);
  
    // Appending the table row to the table (CreditdataList)
    CreditdataList.appendChild(tr);
  });

}

//=================================================================================================================================================================
//===================================================================== FETCH Debits ========================================================================
//=================================================================================================================================================================

fetch(`${loginEndpoint}/debits/${username}`) // Replace URL with your API endpoint
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok.');
  }
  return response.json();
})
.then(data => {
  displayUserDebits(data);
  console.log("log is",data)

})
.catch(error => {
  console.error('There has been a problem with your fetch operation:', error);
});

function displayUserDebits(res) {
  //const data = ['Info 1', 'Info 2', 'Info 3']; // Replace with your data

  const data = JSON.parse(res.data)

  noList.style.display = 'none';
  //document.getElementById("transactions").innerText = transactions;
  console.log("data is ",data)

  transactions = transactions + data.length

  data.forEach(item => {
    const tr = document.createElement('tr');
    // Creating table data cells and setting their attributes

    const td1 = document.createElement('td');
    td1.setAttribute('colspan', '100%');
    td1.classList.add('text-center');
    td1.textContent = item.sn;
  
    const td2 = document.createElement('td');
    td2.setAttribute('colspan', '100%');
    td2.classList.add('text-center');
    td2.textContent =  item.tx;
  
    const td3 = document.createElement('td');
    td3.setAttribute('colspan', '100%');
    td3.classList.add('text-center');
    td3.textContent = `Sent $${item.amount} to ${item.tx} with ref.no ${item.sn}`;
  
    // Appending table data cells to the table row
    //tr.appendChild(td1);
    //tr.appendChild(td2);
    tr.appendChild(td3);
  
    // Appending the table row to the table (CreditdataList)
    dataList.appendChild(tr);
  });
  document.getElementById("transactions").innerText = transactions;

}

