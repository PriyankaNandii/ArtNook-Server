const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




// console.log(process.env.DB_USER);
// console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@atlascluster.yh51je0.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
    await client.connect();
 
    const productCollection = client.db('productDB').collection('product');


    app.get('/product',async(req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/product/:id',async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) } 
      const result = await productCollection.findOne(query);
      res.send(result);
    })
    

    app.post('/product', async(req,res)=>{
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct)
      res.send(result)
    })

    app.delete('/product/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) } 
      const result = await productCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
});
