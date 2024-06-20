const express = require('express');
const cors =  require('cors'); 
const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser');
const {
  generateRandomString, credit, debit, 
  getCredits, getDebits, patch_withdraw, 
  getAllDashboard, getTransactions, getUser,
  create_bene, create_other_bene,getIntraBeneficiaries,
  getInterBeneficiaries,getAccountUser,transfer
} = require('./random')
require('dotenv').config()

const pinataSDK = require('@pinata/sdk');
const { Readable } =  require('stream')
const multer = require('multer');

const upload = multer();


const app = express()
app.use(cors())
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const pinataApiKey = '3cc1438cb9472037c822';
const pinataApiSecret = '3cac6af98f0b3a69a00aa6b3c6948876a465d15e9b36388a77efef8348ca8c21';
const pinata = new pinataSDK(pinataApiKey, pinataApiSecret);
async function storeImages(file, name) {
  console.log('Uploading to IPFS');
  const options = {
    pinataMetadata: {
      name,
    },
  };
  try {
    const result = await pinata.pinFileToIPFS(file, options);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

class BufferStream extends Readable {
  buffer;
  sent;
  constructor(buffer) {
    super();
    this.buffer = buffer;
    this.sent = false;
  }

  _read() {
    if (!this.sent) {
      this.push(this.buffer);
      this.sent = true;
    } else {
      this.push(null);
    }
  }
}


async function getUsers(){

  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Users";
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


async function patch(user,amount){
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
    const findOneResult = await collection.updateOne(query,{$set:{"balance":parseInt(amount) + bal, "deposits":parseInt(amount) + bal}});
    if (findOneResult.modifiedCount === 1) {
      console.log(`${user} updated with new price ${amount} .\n`);
      return true
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 

}


async function onHold(user){
  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Dashboard";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {username: user}
  try {
    const findOneResult = await collection.updateOne(query,{$set:{"active":"false"}});
    if (findOneResult.modifiedCount === 1) {
      console.log(`${user} updated with hold on account .\n`);
      return true
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 

}



async function holdAccount(user){
  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Users";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {username: user}
  try {
    const findOneResult = await collection.updateOne(query,{$set:{"active":"false"}});
    if (findOneResult.modifiedCount === 1) {
      console.log(`${user} updated with hold on account .\n`);
      return true
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 

}



async function releaseAccount(user){
  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Users";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {username: user}
  try {
    const findOneResult = await collection.updateOne(query,{$set:{"active":"true"}});
    if (findOneResult.modifiedCount === 1) {
      console.log(`${user} updated with hold on account .\n`);
      return true
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 

}





async function releaseHold(user){
  const uri = process.env.uri;  
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Dashboard";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const query = {username: user}
  try {
    const findOneResult = await collection.updateOne(query,{$set:{"active":"true"}});
    if (findOneResult.modifiedCount === 1) {
      console.log(`${user} updated with hold on account .\n`);
      return true
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  await client.close(); 

}




async function getDashBoard(_username){
    const uri = process.env.uri;
    
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Dashboard";

  const database = client.db(dbName);
  const collection = database.collection(collectionName);

  const findOneQuery = { username: _username };

  try {
    const findOneResult = await collection.findOne(findOneQuery);
    if (findOneResult === null) {
      console.log(
        `Couldn't find any package that contain ${_username} as an name.\n`
      );
    } else {
      console.log(`Found a recipe with 'potato' as an ingredient:\n${JSON.stringify(findOneResult) }\n`)
      return(JSON.stringify(findOneResult))
      ;
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one document: ${err}\n`);
  }
  // Make sure to call close() on your client to perform cleanup operations
  await client.close(); 
}   

async function login(username,password) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Users";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const findOneQuery = { username: username };

  try {
    const findOneResult = await collection.findOne(findOneQuery);
    if (findOneResult !== null) {
      if (findOneResult.password === password) {
        await client.close();
        return findOneResult ;
        //return true;
      } else {
        await client.close();
        return false;
      }
    } else {
      await client.close();
      return false;
      
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one user: ${err}\n`);
  }
  // Make sure to call close() on your client to perform cleanup operations
  await client.close();
}


async function register(_username, _password, _country, _email, _address, _mobile, _first, _last, _maiden, _image) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);  
  await client.connect();
  const dbName = "SliverStream";
  const collectionName = "Users";
  const database = client.db(dbName);
  const user_collection = database.collection(collectionName);
  const dashboard_collection = database.collection("Dashboard");

  const acc_number = generateRandomString();
  const user = {
    username: _username,
    password: _password,
    country: _country,
    email: _email,
    address: _address,
    mobile: _mobile,
    first_name: _first,
    last_name: _last,
    maiden_name: _maiden,
    acc_num : acc_number,
    image: _image,
    active: "true"
  };

  const dashboard = {
    account: acc_number, // should be 15
    balance : 0,
    deposits: 0,
    transactions: 0,
    fdr: 0,
    dps: 0,
    loan: 0,
    username: _username,
    withdrawals:0,
    active: "true"
  }
  try {
    const insertOneUser = await user_collection.insertOne(user);
    const insertManyDashboard = await dashboard_collection.insertOne(dashboard);
    //console.log(`${user.username} successfully inserted.\n`);
    console.log(`${dashboard.account} successfully inserted.\n`);
    await client.close();
    return true;
  } catch (err) {
    console.error(`Something went wrong trying to insert the new documents: ${err}\n`);
  }
  await client.close();

}


async function root(username,password) {
  const uri = process.env.uri;
  const client = new MongoClient(uri);
  await client.connect();
  const dbName = "Users";
  const collectionName = "Admins";
  const database = client.db(dbName);
  const collection = database.collection(collectionName);
  const findOneQuery = { username: username };

  try {
    const findOneResult = await collection.findOne(findOneQuery);
    if (findOneResult !== null) {
      if (findOneResult.password === password) {
        await client.close();
        return true;

      } else {
        await client.close();
        return false;
      }
    } else {
      await client.close();
      return false;
      
    }
  } catch (err) {
    console.error(`Something went wrong trying to find one user: ${err}\n`);
  }
  // Make sure to call close() on your client to perform cleanup operations
  await client.close();
}


app.get('/dashboard/:user', (req,res)=>{
    async function getMyDashboard(){
        const { user } = req.params;
        const data = await getDashBoard(user);
        res.send({data:data})
    }getMyDashboard()
})


app.get('/transactions/:user', (req,res)=>{
  async function getMyTransactions(){
      const { user } = req.params;
      const data = await getTransactions(user);
      res.send({data:data})
  }getMyTransactions()
})


app.post('/register', upload.single('file'),(req,res)=>{
  async function create_account() {
    let image_url = undefined
    if (req.file !== undefined) {
      //console.log(req.file.buffer)
      const image_stream = new BufferStream(req.file.buffer);
      const url = await storeImages(image_stream,req.file.originalname);
      console.log("url: ",url)
      image_url = "https://ipfs.io/ipfs/"+url.IpfsHash
      console.log("url: ",image_url)
    }
    const { username, password, country, email, address, mobile,first_name,last_name,maiden_name } = req.body;
    const success = await register(username,password,country,email,address,mobile,first_name,last_name,maiden_name,image_url);
    if (success) {
        res.send(success)
    }else{
      res.status(400).send("unable to save to database");
      }
  } create_account()
})


app.post('/credit',(req,res)=>{
  async function create_credit() {
    console.log(req.body)
    const { username, amount, date } = req.body;
    const response = await patch(user,amount)
    const success = await credit(username,amount,date);
    if (success) {
        res.send(success)
    }else{
      res.status(400).send("unable to save to database");
      }
  } create_credit()
})


app.post('/debit',(req,res)=>{
  async function create_debit() {
    console.log(req.body)
    const { username, amount, date } = req.body;
    const response = await patch_withdraw(username,amount)
    const success = await debit(username,amount,date);
    if (success) {
        res.send(success)
    }else{
        res.status(400).send("unable to save to database");
    }
  } create_debit()
})


app.post("/login", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { username, password } = req.body;
    const response = await login(username, password)
    if(response){
      res.send(response)
    }else{
    res.status(400).send("wrong username or password");
    }
  }approve()
})


app.post("/root", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { username, password } = req.body;
    const response = await root(username, password)
    if(response){
      res.send(response)
    }else{
    res.status(400).send("wrong username or password");
    }
  }approve()
})



app.get('/credits/:user', (req,res)=>{
  async function getMyCredit(){
      const { user } = req.params;
      const data = await getCredits(user);
      res.send({data:data})
  }getMyCredit()
})


app.get('/beneficiaries/:user', (req,res)=>{
  async function getMyCredit(){
      const { user } = req.params;
      const data = await getIntraBeneficiaries(user);
      res.send({data:data})
  }getMyCredit()
})

app.get('/inter_beneficiaries/:user', (req,res)=>{
  async function getMyCredit(){
      const { user } = req.params;
      const data = await getInterBeneficiaries(user);
      res.send({data:data})
  }getMyCredit()
})



app.get('/debits/:user', (req,res)=>{
  async function getMyUsers(){
      const { user } = req.params;
      const data = await getDebits(user);
      res.send({data:data})
  }getMyUsers()
})



app.get('/users', (req,res)=>{
  async function getMyUsers(){
      const data = await getUsers();
      res.send({data:data})
  }getMyUsers()
})


app.get('/user/:user', (req,res)=>{
  async function getMyUser(){
      const { user } = req.params;
      const data = await getUser(user);
      res.send({data:data})
  }getMyUser()
})

app.get('/account_num/:acc', (req,res)=>{
  async function getMyAcc(){
      const { acc } = req.params;
      const data = await getAccountUser(acc);
      res.send({data:data})
  }getMyAcc()
})



app.get('/accounts', (req,res)=>{
  async function getMyUsers(){
      const data = await getAllDashboard();
      res.send({data:data})
  }getMyUsers()
})

app.post("/update", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { username, amount,date } = req.body;
    const success = await credit(username,amount,date);
    const response = await patch(username,amount)
    if(response){
      res.status(200).send(response)
    }else{
    res.status(400).send(false);
    }
  }approve()
})








// reject account from transfer
app.post("/hold", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { user } = req.body;
    const response = await onHold(user)
    if(response){
      res.status(200).send(response)
    }else{
    res.status(400).send(false);
    }
  }approve()
})

// reject account from login
app.post("/hold_account", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { user } = req.body;
    const response = await holdAccount(user)
    if(response){
      res.status(200).send(response)
    }else{
    res.status(400).send(false);
    }
  }approve()
})


// release account from transfer hold
app.post("/release", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { user } = req.body;
    const response = await releaseHold(user)
    if(response){
      res.status(200).send(response)
    }else{
    res.status(400).send(false);
    }
  }approve()
})


// release account from login hold
app.post("/release_account", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { user } = req.body;
    const response = await releaseAccount(user)
    if(response){
      res.status(200).send(response)
    }else{
    res.status(400).send(false);
    }
  }approve()
})


app.post("/create_beneficiary", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { username, account_name, account_number, short_name } = req.body;
    const success = await create_bene(username,account_name,account_number,short_name);
    if(success){
      res.status(200).send(success)
    }else{
    res.status(400).send(false);
    }
  }approve()
})

app.post("/other_beneficiary", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { username,bank_name,sort_code,routing_number, account_name, account_number, short_name } = req.body;
    const success = await create_other_bene(username, bank_name, sortcode, routing_number, account_name,account_number,short_name);
    if(success){
      res.status(200).send(success)
    }else{
    res.status(400).send(false);
    }
  }approve()
})


app.post("/transfer", (req, res) => {
  async function approve() {
    console.log(req.body)
    const { user, amount, receiver } = req.body;
    const response = await transfer(user,amount,receiver)
    if(response){
      res.status(200).send(response)
    }else{
    res.status(400).send(false);
    }
  }approve()
})






const port = 8000
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}!.`)
})
