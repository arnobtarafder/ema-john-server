const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors'); 
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3fbgf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const productCollection = client.db("emaJohn").collection("product");

        app.get("/product", async(req, res) => {
            console.log("query", req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if(page || size){
                // 0 --> skip: 0 get: 0-10(10)
                // 0 --> skip: 1 * 10 get: 11-20(10)
                // 0 --> skip: 2 * 10 get: 21-30(10)
                // 0 --> skip: 3 * 10 get: 31-40(10)
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else{
                products = await cursor.toArray()
            }
            // const products = await cursor.limit(10).toArray();
            // const result = res.send(products)
            // console.log(result);
            res.send(products)
        })

        app.get("/productCount", async(req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const count = await cursor.count();
            res.send({count});
        })
    }
    finally{}
}
run().catch(console.dir)


app.get("/", (req, res) => {
    res.send("John is running and waiting for his parents");
})

app.listen(port, () => {
    console.log("John is running on port", port + 2000);
})