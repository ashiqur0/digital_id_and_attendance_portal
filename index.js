const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.POR || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Nime.org server....');
});

// mongodb connection uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.edix7i0.mongodb.net/?appName=Cluster0`;

// create mongodb client
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // connect the client
        await client.connect();

        // create database 
        const db = client.db('smart_attendance');

        // create collection
        const classAttendanceCollection = db.collection('class_attendance');
        const libraryEntriesCollection = db.collection('library_entries');
        const campusEventCollection = db.collection('campus_event');

        // event related api
        app.post('/event', async(req, res) => {
            const participant = req.body;
            const result = await campusEventCollection.insertOne(participant);
            res.send(result);
        });

        app.get('/event', async(req, res) => {
            const cursor = campusEventCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        
        // library related api
        app.post('/library', async(req, res) => {
            const entrance = req.body;
            const result = await libraryEntriesCollection.insertOne(entrance);
            res.send(result);
        });

        app.get('/library', async(req, res) => {
            const cursor = libraryEntriesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });
        
        // attendance related api
        app.post('/attendance', async(req, res) => {
            const present = req.body;
            const result = await classAttendanceCollection.insertOne(present);
            res.send(result);
        });

        app.get('/attendance', async(req, res) => {
            const cursor = classAttendanceCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        });

        // check the connection status
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // close database connection
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, (req, res) => {
    console.log(`Server is running at http://localhost:${port}`);
})