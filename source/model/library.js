var express = require('express'),
        http = require('http'),
        url = require('url'),
        querystring = require('querystring'),
        couchdb = require('felix-couchdb'),
        bcrypt = require('bcrypt-nodejs'),
        nodemailer = require('nodemailer'),
        path = require('path'),
        crypto = require('crypto'),
        bodyParser = require('body-parser'),
        cradle = require('cradle'),
        argv = require('optimist').argv;
var fs = require('fs');
var app = module.exports = express();
dbName = "ilmdb";
hostDb = "mostafiz.iriscouch.com";
var userDoc = "user";
var algorithm = 'aes256'; 
var key = 'password';


var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "mostafiz023057@gmail.com",
        pass: "musi@023057"
    }
});


app.use(bodyParser.urlencoded({
    limit:'50mb',
    extended: true
}));
app.use(bodyParser.json({limit:'50mb'}));

if( argv.localDb)
{
 console.log("local db connected");
    hostDb = "http://localhost";
 }
 else{
  console.log("remote db connected");
 }

 if(typeof  argv.dbName != 'undefined'){
   dbName = argv.dbName;
 }

  cradle.setup({
        host: hostDb,
        cache: true,
        raw: false,
        forceSave: true
      });
var client = new(cradle.Connection);
db = client.database(dbName);


app.get('/api/category', function(req, res) {
    var userList = [];
    readDesign(userDoc, 'libraryCategory', {"key": '3'}, function(err, userDoc) {
        if (err) {
            console.log("Fail to pickup data from database for roll 1 !",extraRoll);
        }
        else {
            var users = userDoc.rows;
             res.send(users);
        }

    });
});

app.post('/api/saveLibrary', function(req, res) {
     var libraryData = req.body;
     var docID = 'library_'+libraryData.title;
     db.save(docID, libraryData, function(err, userDoc) {
        if (err) {
            status = {status: false};
            console.log("Fail to save library data !");
        }
        else {
            status = {status: true};
            console.log("Save successful library");
        }
        res.send(status);
    });
});

app.post('/api/uploadFile' , function(req,res){


    var file_data = req.body;
    var docID = 'library_'+file_data.title;

    db.get(docID , function(err,doc){
        if(err){
            doc = {
            _id: "81d98e4974e426f19b9dcd075a00074c",
            _rev: "3-da9a3e6320b2768e68323d7e36d3401f"
            };
        }
        var idData = {
            id: doc._id,
            rev: doc._rev
        }

        var filename = file_data.uploadFile; 
        var filePath = path.join('F:', ' eBook', 'couchdb.pdf');
        var readStream = fs.createReadStream;

        var attachmentData = {
            name: "couchdb.pdf",
            "Content-Type": "epub/zip"
        }

        db.saveAttachment(idData, attachmentData, function (err, reply) {
        if (err) {
            console.dir(err)
            return
        }
            console.dir(reply)
            }, readStream);
        })

});

var readDesign = function (design, view, query, callback) {
    var vw = design + "/" + view; 
    db.view(vw, query, callback);
}


