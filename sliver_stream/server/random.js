const { MongoClient } = require("mongodb");
require('dotenv').config()


function generateRandomString() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomString = '';

  // // Generate 2 random letters
  // for (let i = 0; i < 2; i++) {
  //   const randomIndex = Math.floor(Math.random() * letters.length);
  //   randomString += letters.charAt(randomIndex);
  // }

  // Generate 10 random numbers
  for (let i = 0; i < 10; i++) {
    randomString += Math.floor(Math.random() * 10);
  }

  return randomString;
}

async function credit(_username, _amount,date) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);  
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Credits";
  const database = client.db(dbName);
  const tx_collection = database.collection(collectionName);
  const Transactions_collection = database.collection("Transactions")

  const sn = generateRandomString()
  const tx = generateRandomString()
  const txs = {
    username: _username,
    amount: _amount,
    sn: sn,
    tx: tx,
  };
  const transactions = {
    username: _username,
    amount: _amount,
    sn: sn,
    tx: tx,
    type: "credit",
    date: date, 
    category: "Intra Bank",
    receiptient: generateRandomString()
  }
  try {
    const insertOneUser = await tx_collection.insertOne(txs);
    const insertTransactions = await Transactions_collection.insertOne(transactions);
    await client.close();
    return true;
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }
  await client.close();

}

async function debit(_username, _amount, date) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);  
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Debits";
  const database = client.db(dbName);
  const tx_collection = database.collection(collectionName);
  const Transactions_collection = database.collection("Transactions")

  const sn = generateRandomString()
  const tx = generateRandomString()
  const txs = {
    username: _username,
    amount: _amount,
    sn: sn,
    tx: tx,
  };
  const transactions = {
    username: _username,
    amount: _amount,
    sn: sn,
    tx: tx,
    date: date, 
    type: "debit",
    category: "Intra Bank",
    receiptient: generateRandomString()
  }
  try {
    const insertOneUser = await tx_collection.insertOne(txs);
    const insertTransactions = await Transactions_collection.insertOne(transactions);
    await client.close();
    return true;
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }
  await client.close();

}


async function getCredits(user){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Credits";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  
  
  try {
    const documents = await collection.find({username:user}).toArray()
    if (documents === null) {
      console.log(`Couldn't find any package.\n`);
    } else {
      return(JSON.stringify(documents))
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 
} 

async function getIntraBeneficiaries(user){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Beneficiaries";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  
  
  try {
    const documents = await collection.find({username:user}).toArray()
    if (documents === null) {
      console.log(`Couldn't find any package.\n`);
    } else {
      return(JSON.stringify(documents))
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 
} 

async function getInterBeneficiaries(user){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "OutsideBeneficiaries";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  
  
  try {
    const documents = await collection.find({username:user}).toArray()
    if (documents === null) {
      console.log(`Couldn't find any package.\n`);
    } else {
      return(JSON.stringify(documents))
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 
} 



async function getDebits(user){
  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Debits";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  
  
  try {
    const documents = await collection.find({username:user}).toArray()
    if (documents === null) {
      console.log(`Couldn't find any package.\n`);
    } else {
      return(JSON.stringify(documents))
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 
} 


async function patch_withdraw(user,amount){
  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Dashboard";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {username: user}

  try {
    const result = await collection.findOne(query);
    const bal = parseInt(result.balance)
    const findOneResult = await collection.updateOne(query,{$set:{"withdrawals":parseInt(result.withdrawals) + parseInt(amount)}});
    const findResult = await collection.updateOne(query,{$set:{"balance":bal - parseInt(amount)}});
    if (findOneResult.modifiedCount === 1) {
      console.log(`${user} updated with new price ${amount} .\n`);
      return true
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 

}

async function getAllDashboard(){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Dashboard";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  
  
  try {
    const documents = await collection.find().toArray();
    if (documents === null) {
      console.log(`Couldn't find any package.\n`);
    } else {
      return(JSON.stringify(documents))
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 
} 


async function getTransactions(user){
  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Transactions";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {username: user}
  try {
    const documents = await collection.find(query).toArray()
    if (documents === null) {
      console.log(`Couldn't find any package.\n`);
    } else {
      return(JSON.stringify(documents))
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close();
}


async function getUser(user){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Users";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {username: user}  
  try {
    const documents = await collection.findOne(query);
    if (documents === null) {
      console.log(`Couldn't find any package.\n`);
    } else {
      return(JSON.stringify(documents))
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 
} 



async function getAccountUser(acc){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Users";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {acc_num: acc}  
  try {
    const documents = await collection.findOne(query);
    if (documents === null) {
      console.log(`Couldn't find any package.\n`);
    } else {
      return(JSON.stringify(documents))
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 
} 




async function create_bene(username,account_name,account_number,short_name ) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);  
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Beneficiaries";
  const database = client.db(dbName);
  const user_collection = database.collection(collectionName);
  const user = {
    username: username,
    short_name: short_name,
    account_name: account_name,
    account_number : account_number
  };

  try {
    const insertOneUser = await user_collection.insertOne(user);
    await client.close();
    return true;
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }
  await client.close();

}


async function create_other_bene(username,bank_name,sort_code,routing_number,account_name,account_number,short_name ) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);  
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "OutsideBeneficiaries";
  const database = client.db(dbName);
  const user_collection = database.collection(collectionName);
  const user = {
    username: username,
    bank_name:bank_name,
    sort_code:sort_code,
    routing_number:routing_number,
    short_name: short_name,
    account_name: account_name,
    account_number : account_number
  };

  try {
    const insertOneUser = await user_collection.insertOne(user);
    await client.close();
    return true;
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }
  await client.close();

}


async function transfer(user,amount,receiver){
  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Dashboard";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {username: user}
  const receiver_query = {account:receiver}
  const date = new Date().toDateString();
  try {
    const result = await collection.findOne(query);
    const receiver_result = await collection.findOne(receiver_query);
    const receiver_new_balance = parseInt(receiver_result.balance) + parseInt(amount) ;
    const prev_balance = parseInt(result.balance)
    const new_balance = prev_balance - parseInt(amount);
    const new_withdrawal = parseInt(result.withdrawals) + parseInt(amount);
    const new_deposits = parseInt(receiver_result.deposits) + parseInt(amount);
    const SenderBalance = await collection.updateOne(query,{$set:{"balance":new_balance, "withdrawals":new_withdrawal}});
    const RecieverBalance = await collection.updateOne(receiver_query,{$set:{"balance":receiver_new_balance, "deposits":new_deposits}});

    if(SenderBalance.modifiedCount === 1 && RecieverBalance.modifiedCount === 1) {
      console.log(`${user} updated with new price ${amount} .\n`);




    const options = { ordered: true };
    const tx_collection = database.collection("Debits");
    const tx_credit = database.collection("Credits")
    const Transactions_collection = database.collection("Transactions")

    const sn = generateRandomString()
    const tx = generateRandomString()
    const debit_txs = {
      username: user,
      amount: amount,
      sn: sn,
      tx: receiver,
      date: date
    };
    const credit_txs = {
      username: receiver_result.username,
      amount: amount,
      sn: sn,
      tx: result.account,
      date: date
    };
    const debit_transactions = {
      username: user,
      amount: amount,
      sn: sn,
      tx: tx,
      date: date, 
      type: "debit",
      category: "Intra Bank",
      receiptient: receiver
    }
    const credit_transactions = {
      username: receiver_result.username,
      amount: amount,
      sn: sn,
      tx: tx,
      date: date, 
      type: "credit",
      category: "Intra Bank",
      sender: result.account
    }
    try {
      const insertDebit = await tx_collection.insertOne(debit_txs);
      const insertCredit = await tx_credit.insertOne(credit_txs);
      const insertTransactions = await Transactions_collection.insertMany([debit_transactions,credit_transactions],options);
    } catch (err) {
      console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
    }








      return true
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 

}






module.exports = {
  generateRandomString,
  credit,
  debit,
  getCredits,
  getDebits,
  patch_withdraw,
  getAllDashboard,
  getTransactions,
  getUser,
  create_bene,
  create_other_bene,
  getIntraBeneficiaries,
  getInterBeneficiaries,
  getAccountUser,
  transfer
};
