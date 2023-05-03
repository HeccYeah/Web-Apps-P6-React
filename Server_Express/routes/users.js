var express = require('express');
var router = express.Router();
//var md5 = require('md5');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://mad_project6:Sywabz8RC8foU4jw@project6.zspxevg.mongodb.net/APE?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get("/users/:id", async (req, res) => {
  try {
    // Connect the client to the server
    await client.connect();
    let collection = db.collection("user");

    // Retrieve the massive amount of data from MongoDB
    let data = await collection.aggregate([
      {
        $match: {
          s_id: req.params.id
        }
      } /*   ,


      {
        $lookup: {
          from: "plan",
          localField: "s_id",
          foreignField: "owner_id",
          as: "plans"
        }
      },

      {
        $lookup: {
          from: "has_course",
          localField: "plans.p_id",
          foreignField: "p_id",
          as: "courseRefs"
        }
      },

      {
        $lookup: {
          from: "course",
          localField: "has_course.c_id",
          foreignField: "c_id",
          as: "courseForRef"
        }
      },*/

      // DO A BUTT-TON MORE OF THESE, BUT FIRST GET 1 WORKING
    ])

    await client.close();

    res.setHeader("Content-Type", "application/json")
    res.send(data);
  } catch (err) {
      // respond with error for invalid request
      console.error(err);
      res.status(500).send('Error retrieving data from MongoDB');
  }
});


/*
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    

    // Insert data
    for (const nm of collectionNames) {
      // get collection for mongoDB 
      let collection = db.collection(nm);

      let data = fs.readFileSync(`./mySqlData/mad_${nm}.json`, "utf8");
      let pd = JSON.parse(data)[2].data;
      for (const row of pd) {
        try {
          await collection.insertOne(row);
        } catch (err) {
          console.error(err);
        }
      }
    }

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
*/

module.exports = router;