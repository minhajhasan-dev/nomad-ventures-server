const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// code from MongoDB Atlas
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uqfy7cb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // our code will go here
    app.get("/cards", async (req, res) => {
      const database = client.db("nomad-ventures");
      const collection = database.collection("cards");
      const cards = await collection.find({}).toArray();
      res.send(cards);
    });

    // post a tourist spot to the database
    app.post("/touristSpot", async (req, res) => {
      const database = client.db("nomad-ventures");
      const collection = database.collection("touristSpot");
      const result = await collection.insertOne(req.body);
      res.send(result);
      console.log(result);
    });
    // get data from the database
    app.get("/touristSpot", async (req, res) => {
      const database = client.db("nomad-ventures");
      const collection = database.collection("touristSpot");
      const touristSpot = await collection.find({}).toArray();
      res.send(touristSpot);
    });

    // update information to the database
    app.put("/touristSpot/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          countryName: req.body.countryName,
          location: req.body.location,
          touristSpotName: req.body.touristSpotName,
          averageCost: req.body.averageCost,
          shortDescription: req.body.shortDescription,
          seasonality: req.body.seasonality,
          travelTime: req.body.travelTime,
          totalVisitorsPerYear: req.body.totalVisitorsPerYear,
          imageUrl: req.body.imageUrl,
        },
      };
      const result = await client
        .db("nomad-ventures")
        .collection("touristSpot")
        .updateOne(query, data);
      res.send(result);
    });

    // delete information from the database
    app.delete("/touristSpot/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await client
        .db("nomad-ventures")
        .collection("touristSpot")
        .deleteOne(query);
      res.send(result);
    });

    // get countries data from the database 
    app.get("/countries", async (req, res) => {
      const database = client.db("nomad-ventures");
      const collection = database.collection("countries");
      const countries = await collection.find({}).toArray();
      res.send(countries);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Nomad Ventures Server is running...");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
