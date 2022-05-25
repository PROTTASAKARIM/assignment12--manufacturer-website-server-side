const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.kdux9.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const productCollection = client.db('manufacturer').collection('products');
        const orderCollection = client.db('manufacturer').collection('orders');
        const reviewCollection = client.db('manufacturer').collection('reviews');

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = productCollection.find(query);
            const product = await cursor.toArray();
            res.send(product);
        });
        app.post('/orders', async (req, res) => {
            const order = req.body;
            // const query = { productId: order.productId, orderEmail: order.orderEmail }
            // const exists = await orderCollection.findOne(query);
            // if (exists) {
            //     return res.send({ success: false, order: exists })
            // }
            const result = await orderCollection.insertOne(order);
            res.send({ success: true, result })

        });
        app.get('/orders', async (req, res) => {
            const orderEmail = req.query.orderEmail;
            const query = { orderEmail: orderEmail };
            const orders = await orderCollection.find(query).toArray();
            res.send(orders)
        });
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send({ success: true, result })

        });
        app.get('/reviews', async (req, res) => {
            const query = {};
            const orders = await reviewCollection.find(query).toArray();
            res.send(orders)
        });





    }
    finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello From Doctor Uncle own portal!')
})

app.listen(port, () => {
    console.log(`Doctors App listening on port ${port}`)
})