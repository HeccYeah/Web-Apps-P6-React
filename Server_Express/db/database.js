var mysql = require('mysql');
var md5 = require('md5');

var db = mysql.createConnection({
    host: "james.cedarville.edu",
    database: "cs3220_sp23",
    user: "cs3220_sp23",
    password: "E57y6Z1FwAlraEmA"
});

db.connect(function(err){
    if(err) throw err;
    console.log("Connected");
});

module.exports = db;