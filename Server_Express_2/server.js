const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
//const models = require("./models.js");

const app = express();

app.use(cors());
app.use(bodyParser.json());



const uri = "mongodb+srv://mad_project6:Sywabz8RC8foU4jw@project6.zspxevg.mongodb.net/APE?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    }
});

client.connect();
let db = client.db();

const { schema } = mongoose;

app.get("/users/:id", async (req, res) => {
    try {
        // Connect the client to the server
        await client.connect();
        let collection = db.collection("user");
        let userId = req.params.id;

        // Retrieve the massive amount of data from MongoDB
        let dataComb = await collection.aggregate([
            {
                $match: {
                    s_id: req.params.id
                },
            },

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
                    from: "plan_year",
                    localField: "plans.p_id",
                    foreignField: "p_id",
                    as: "plan_years"
                }
            },

            {
                $lookup: {
                    from: "note",
                    localField: "plans.p_id",
                    foreignField: "p_id",
                    as: "plan_notes"
                }
            },

            {
                $lookup: {
                    from: "cat_course",
                    localField: "catalog_year",
                    foreignField: "catalog_year",
                    as: "cat_course_refs"
                }
            },

            {
                $lookup: {
                    from: "course",
                    localField: "cat_course_refs.c_id",
                    foreignField: "c_id",
                    as: "courses"
                }
            },

            {
                $lookup: {
                    from: "in_major",
                    localField: "s_id",
                    foreignField: "s_id",
                    as: "majMinRefs"
                }
            },

            {
                $lookup: {
                    from: "major_minor",
                    localField: "majMinRefs.m_id",
                    foreignField: "m_id",
                    as: "majMins"
                }
            },

            {
                $lookup: {
                    from: "requirement",
                    localField: "majMins.m_id",
                    foreignField: "m_id",
                    as: "reqs"
                }
            },
        ])

        let data = await dataComb.toArray();

        /*
        let data = await models.User.findOne({s_id: userId})
            .populate({
                path: "plans",
                match: {owner_id: { $eq: "$s_id"}},
                model: models.Plan,
            })
            .exec();
        console.log(3);
        */
    
        res.setHeader("Content-Type", "application/json")
        res.send(JSON.stringify(data));

    } catch (err) {
        // respond with error for invalid request
        console.error(err);
        res.status(500).send('Error retrieving data from MongoDB');
    }
  });

  const port = 3001;

  app.listen(port, () => {
    console.log("server running");
  });

  