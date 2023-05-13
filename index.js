const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


//Port
const app = express();
const port = process.env.PORT || 5000;


// middle wares
app.use(cors());
app.use(express.json()); 


//MongoDB Connection  
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xbkhg1t.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


//Main
async function run(){
    try{
        const usersCollectionApp = client.db('App').collection('appUsers');
        const sellDetails = client.db('App').collection('sellDetails');
        const productDetails = client.db('App').collection('productDetails');
       


    //Get Users
    app.get('/appUsers', async (req, res) => {
        let query = {};
        const cursor = usersCollectionApp.find(query);
        const a = await cursor.toArray();
        res.send(a);
    });


    //Post Users
    app.post('/appUsers', async (req, res) => {
        const user = req.body;
        const result = await usersCollectionApp.insertOne(user);
        res.send(result);
    });


    //Get Users by Role
    app.get('/appUserEmail', async (req, res) => {
        let query = {};

        if (req.query.email) {
            query = {
                email: req.query.email
            }
        }
        const cursor = usersCollectionApp.find(query);
        const review = await cursor.toArray();
        res.send(review);
    });


    //Get Customer Details
    app.get('/customerInfo', async (req, res) => {
        let query = {};
        const cursor = sellDetails.find(query).sort({$natural:-1});
        const a = await cursor.toArray();
        res.send(a);
    });


    //Post Customer Details
    app.post('/customerInfo', async (req, res) => {
        const user = req.body;
        const result = await sellDetails.insertOne(user);
        res.send(result);
    });


    //Get Single Customer Details
    app.get('/singleDetails/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const b = await sellDetails.findOne(query);
        res.send(b);
    });


    //Update Customer Details
    app.patch('/singleDetails/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const user = req.body;
        const option = {upsert: true};
        const updatedUser = {
            $set: {
                
                    date: user.date, 
                    total: user.total,
                    paid: user.paid, 
                    due: user.due,
                    note: user.note,
            }
        }
        const result = await sellDetails.updateOne(filter, updatedUser, option);
        res.send(result);
    })


    //Post Product
    app.post('/productInfo', async (req, res) => {
        const user = req.body;
        const result = await productDetails.insertOne(user);
        res.send(result);
    });


    //Get Product
    app.get('/productInfo', async (req, res) => {
        let query = {};
        const cursor = productDetails.find(query);
        const a = await cursor.toArray();
        res.send(a);
    });


    //Get Single Product
    app.get('/updateProduct/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const b = await productDetails.findOne(query);
        res.send(b);
    });

    //Update Product
    app.patch('/updateProduct/:id', async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const a = req.body;
        const option = {upsert: true};
        const updatedUser = {
            $set: {
                
                    price: a.price, 
                    
            }
        }
        const result = await productDetails.updateOne(filter, updatedUser, option);
        res.send(result);
    })


    }
    finally{

    }
}

run().catch(err => console.error(err))


app.get('/',(req,res)=>{
    res.send('App Server Running')
})

app.listen(port, ()=>{
    console.log(`App Server Running${port}`)
})