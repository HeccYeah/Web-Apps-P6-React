const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const mongodb = require('mongodb');
const cors = require("cors");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());


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

//const { schema } = mongoose;

app.get("/users/:id", async (req, res) => {
    try {
        // Connect the client to the server
        let collection = db.collection("user");
        let userId = req.params.id;

        // Retrieve the massive amount of data from MongoDB
        let dataComb = await collection.aggregate([
            {
                $match: {
                    s_id: userId
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
    
        res.setHeader("Content-Type", "application/json")
        res.send(JSON.stringify(data));

    } catch (err) {
        // respond with error for invalid request
        console.error(err);
        res.status(500).send('Error retrieving data from MongoDB');
    }
});

app.get("/prof/:id", async (req, res) => {
    try {
        // Connect the client to the server
        let collection = db.collection("user");
        let userId = req.params.id;

        // Retrieve the massive amount of data from MongoDB
        let dataComb = await collection.aggregate([
            {
                $match: {
                    s_id: userId
                },
            },

            {
                $lookup: {
                    from: "advises",
                    localField: "s_id",
                    foreignField: "advisor_id",
                    as: "advisesRefs"
                }
            },

            {
                $lookup: {
                    from: "user",
                    localField: "advisesRefs.advises_id",
                    foreignField: "s_id",
                    as: "advisees"
                }
            },
        ])
        

        let data = await dataComb.toArray();
    
        res.setHeader("Content-Type", "application/json")
        res.send(JSON.stringify(data));

    } catch (err) {
        // respond with error for invalid request
        console.error(err);
        res.status(500).send('Error retrieving data from MongoDB');
    }
});

// insert a new year for a plan into the database
app.post("/plan_year", async (req, res) => {
    let newYear = {
        p_id: req.body.p_id,
        year: req.body.year,
    };

    let collection = db.collection("plan_year");

    collection.insertOne(newYear, function(err, result) {
        assert.equal(null, err);
        res.send("Success");
    });
});

// delete a year from a plan in the database
app.delete("/plan_year/:p_id/:year", async (req, res) => {
    let query = {
        p_id: req.params.p_id,
        year: req.params.year
    };

    let collection = db.collection("plan_year");

    collection.deleteOne(query, function(err, result) {
        assert.equal(null, err);
        res.send("Delete success");
    });
});

// insert a new note for a plan into the database
app.post("/note", async (req, res) => {
    let newNote = {
        n_id: req.body.n_id,
        p_id: req.body.p_id,
        creatorID: req.body.creatorID,
        note: req.body.note
    };

    let collection = db.collection("note");

    collection.insertOne(newNote, function(err, result) {
        assert.equal(null, err);
        res.send("Success");
    });
});

// delete a note from a plan in the database
app.delete("/note/:n_id", async (req, res) => {
    let query = {
        n_id: req.params.n_id,
    };

    let collection = db.collection("note");

    collection.deleteOne(query, function(err, result) {
        assert.equal(null, err);
        res.send("Delete success");
    });
});

// insert a new course for a plan into the database
app.post("/has_course", async (req, res) => {
    try {
        let newNote = {
            p_id: req.body.p_id,
            c_id: req.body.c_id,
            sem: req.body.sem,
            year: req.body.year,
            school_year: req.body.school_year,
        };

        let collection = db.collection("has_course");

        const result = await collection.insertOne(newNote);
        res.send(result.insertedId);
    } catch (err) {
        console.error('Error inserting document:', err);
        res.status(500).send('Internal Server Error');
    }
});

// delete a a course for a plan in the database
app.delete("/has_course/:_id", async (req, res) => {
    let idObj = new mongodb.ObjectId(req.params._id);

    let query = {
        _id: idObj
    };

    let collection = db.collection("has_course");

    collection.deleteOne(query, function(err, result) {
        assert.equal(null, err);
        res.send("Delete success");
    });
});

app.put("/has_course/:_id", async (req, res) => {
    let idObj = new mongodb.ObjectId(req.params._id);

    const filter = {
        _id: idObj
    }

    let update = {};

    for (let key in req.body) {
        if (req.body.hasOwnProperty(key)) {
            update[key] = req.body[key];
        }
    }

    let collection = db.collection("has_course");

    collection.updateOne(filter, { $set: update }, function(err, result) {
        assert.equal(null, err);
        res.send("Update Success");
    });
});

//Validate login credentials
app.post("/login", async (req, res) => {
    let isAuthenticated = false;
    //Get the user collection
    let users = db.collection("user");

    //Get the username and password from login form
    let username = req.body.field1;
    let pass = req.body.field2;

    let query = {
        username: username
    }
    let user = await users.find(query).toArray();
    let hashPass = user[0].password;
    let id = user[0].s_id;
    let role = user[0].Role;
    console.log(role);

    if(bcrypt.compare(pass, hashPass)){
        isAuthenticated = true;
    }
    else{
        isAuthenticated = false;
    }

    res.cookie("id", id);
    if(role == "Student"){
        res.cookie("isAuthenticated", isAuthenticated).redirect("http://localhost:3000/student");
    }
    else if (role == "Advisor"){
        res.cookie("isAuthenticated", isAuthenticated).redirect("http://localhost:3000/professor");
    }
})

app.post("/create", async (req, res) => {
    console.log("in create");
    //Get the user collection
    let users = db.collection("user");

    //Get user info from createUser form
    let fname = req.body.field1;
    let lname = req.body.field2;
    let id = req.body.field3;
    let isMale = req.body.field4;
    let catYear = req.body.field5;
    let username = req.body.field6;
    let password = req.body.field7;

    let query = {
        s_id: id,
        first_name: fname,
        last_name: lname,
        is_male: isMale,
        catalog_year: catYear,
        username: username,
        password: password,
        savior: "Jesus",
        Role: "Student"
    }
    console.log("before insert");
    const result = await users.insertOne(query);
    res.redirect("http://localhost:3000/login");

})

const port = 3001;

app.listen(port, () => {
    console.log("server running");
});