var express = require('express'),
        http = require('http'),
        url = require('url'),
        querystring = require('querystring'),
        couchdb = require('felix-couchdb'),
        bcrypt = require('bcrypt-nodejs'),
        nodemailer = require('nodemailer'),
        path = require('path'),
        cradle = require('cradle'),
        argv = require('optimist').argv;
var isDBCreated = false;
var fs = require('fs');
 docStatus = false;
 dbName = "ilmdb";
 hostDb = "mostafiz.iriscouch.com";
var app = module.exports = express();
app.get('/', function(req, res) {
    res.render('index.html');
});

/**Create Couch default Database  **/
module.exports.initDb = function() {
if( argv.localDb)
{
 console.log("local db");
    hostDb = "http://localhost";
 }
 else{
  console.log("remote db");
 }

 if(typeof  argv.dbName != 'undefined'){
   console.log("local db Name----",argv.dbName)
   dbName = argv.dbName;
 }

 if(argv.docUpload){
    docStatus = true;
 }
 else{
   docStatus = false;
 }
 
 cradle.setup({
        host:hostDb,
        cache: true,
        raw: false,
        forceSave: true
      });

     var client = new(cradle.Connection);
     db = client.database(dbName);
    createDBInterval = setInterval(function() {
        db.create(dbCreateCallback);
    }, 4000);

  
};

function dbCreateCallback(err, data) {
    if (!isDBCreated && err == null && data && data.ok == true) {
        isDBCreated = true;
        clearInterval(createDBInterval);
        addDesignDoc();
    } else if (err && err.error && err.error == "file_exists") {
        if(docStatus){
            addDesignDoc();
        }
       clearInterval(createDBInterval);
    } else {
        console.log("Unable to reach CouchDB, attempting again", err);
    }
}

function addDesignDoc() {
    var fileDir = "couchDocuments/";
    var files = fs.readdirSync(fileDir);
    var count = files.length;

    for (indexer = 0; indexer < count; indexer++) {
        var file = files[indexer];
        console.log("Uploaded  file name is ----",file)
        var data = fs.readFileSync(fileDir + file, 'utf8');
        var jsonData = JSON.parse(data);
        db.save(jsonData);
    }
}
;