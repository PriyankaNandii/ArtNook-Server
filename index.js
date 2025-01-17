const express = require("express");
const cors = require("cors");
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());







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

// Define subcategory data
const subcategories = [
  { name: 'Card Making' },
  { name: 'Scrapbooking' },
  { name: 'Paper Quilling & Origami' },
  { name: 'Glass Painting' },
  { name: 'Glass Dying & Staining' },
  { name: 'Lampworking' },
 
];


async function run() {
  try {
   
    await client.connect();
 
    const productCollection = client.db('productDB').collection('product');

    const subcategoryCollection = client.db('productDB').collection('subcategories');
    

    app.get('/subcategories', async (req, res) => {
      try {
        const subcategoriesCursor = await subcategoryCollection.find().limit(6); 
        const subcategories = await subcategoriesCursor.toArray(); 
        res.json(subcategories);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
    



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
  // myList
    app.get("/mycraft/:email", async (req, res) => {
      console.log(req.params.email);
      const result = await productCollection.find({ email: req.params.email }).toArray();
      res.json(result); 
  })
  


    app.put('/product/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateProduct =  req.body;
      const product = {
        $set: {
          name: updateProduct.name,
          photo: updateProduct.photo,
          subcategory: updateProduct.subcategory,
          description: updateProduct.description,
          price: updateProduct.price,
          rating: updateProduct.rating,
          customization: updateProduct.customization,
          processing: updateProduct.processing,
          stock: updateProduct.stock,
          // email: updateProduct.email,
          // username: updateProduct.username
        }
      }

      const result = await productCollection.updateOne(filter, product, options)
      res.send(result)
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
