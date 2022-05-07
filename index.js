const express = require("express");
const cors = require("cors");
require("dotenv").config();
const post = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

//pass:f97Vhu0SEYJsX9lI
//user:car-warehouse

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.acnhi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const serviceCollection = client
      .db("car-warehouse")
      .collection("car-items");

    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });
    app.get('/inventory/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);    
  });
  app.post("/inventory", async (req, res) => {
    const newService = req.body;  
        const result = await serviceCollection.insertOne(newService);
        res.send(result);
   
  });
   // DELETE
   app.delete('/inventory/:id', async(req, res) =>{
    const id = req.params.id;
    console.log(id);
    const query = {_id: ObjectId(id)};
    const result = await serviceCollection.deleteOne(query);
    res.send(result);
});
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("runing car warehouse server");
});

app.listen(post, () => {
  console.log("litening to post", post);
});
