import { MongoClient } from "mongodb"

if (!process.env.MONGO_URL) {
  throw new Error('Invalid/Missing environment variable: "MONGO_URL"');
}

const uri = process.env.MONGO_URL;
const options = {};

let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export default clientPromise;

//  const { MongoClient, ServerApiVersion } = require('mongodb');
//  const uri = "mongodb+srv://iastejasnavale10:pLcOgWakXh650nAC@cluster0.2nozy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//  const client = new MongoClient(uri, {
//    serverApi: {
//      version: ServerApiVersion.v1,
//      strict: true,
//      deprecationErrors: true,
//    }
//  });

//  async function run() {
//    try {
//      // Connect the client to the server	(optional starting in v4.7)
//      await client.connect();
//      // Send a ping to confirm a successful connection
//      await client.db("admin").command({ ping: 1 });
//      console.log("Pinged your deployment. You successfully connected to MongoDB!");
//    } finally {
//      // Ensures that the client will close when you finish/error
//      await client.close();
//    }
//  }
//  run().catch(console.dir);
