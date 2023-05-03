var { MongoClient, ServerApiVersion } = require('mongodb');
var md5 = require('md5');

const uri = "mongodb+srv://mad_project6:Sywabz8RC8foU4jw@project6.zspxevg.mongodb.net/APE?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
await client.connect();
        let db = client.db();


db.connect(function(err){
    if(err) throw err;
    console.log("Connected");
});

module.exports = db;
