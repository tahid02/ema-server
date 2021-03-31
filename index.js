const express = require('express')
require('dotenv').config()
var bodyParser = require('body-parser')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z6ers.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const uri = `mongodb+srv://emaWatson:emaWatsonPotter@cluster0.z6ers.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;

const app = express()
const port = 5000

app.use(express.json() )
app.use(cors())
console.log(process.env.DB_USER);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  console.log('database connected');
  // perform actions on the collection object

    app.post('/addProduct' , (req, res ) => {
        const products = req.body;
        console.log('products aded')
        
        productsCollection.insertOne(products)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount  )
        })
    })

    app.get('/products', (req, res) => {
      productsCollection.find({}).toArray( (err,documents) =>{
        res.send(documents)        
      })
    })


    app.get('/product/:key' , (req,res,next) =>{
      productsCollection.find({key: req.params.key}).toArray( (err,documents) =>{
        res.send(documents[0])        
      })
    })

    app.post('/productsByKeys', (req , res) =>{
      const productKey = req.body;
      productsCollection.find( { key: { $in: productKey }})
      .toArray( (err, documents ) =>{
        res.send(documents)
      })
    })


    // add order in ordersCollection 

    app.post('/addOrder' , (req, res ) => {
      const order = req.body;
      console.log('products aded')
      
      ordersCollection.insertOne(order)
      .then(result => {
          console.log(result.insertedCount);
          res.send(result.insertedCount > 0 )
      })
  })

  app.get('/', function (req, res) {
    res.send('hello world')
  })
//   client.close();
});


  
app.listen(process.env.PORT || port)

