var express = require('express'),
        http = require('http'),
        url = require('url'),
        querystring = require('querystring'),
        couchdb = require('felix-couchdb'),
        bcrypt = require('bcrypt-nodejs'),
        nodemailer = require('nodemailer'),
        path = require('path'),
        cradle = require('cradle'),
        crypto = require('crypto'),
        bodyParser = require('body-parser'),
        argv = require('optimist').argv;

var fs = require('fs');
var app = module.exports = express();
dbName = "ilmdb";
hostDb = "mostafiz.iriscouch.com";
var userDoc = "user";
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: "mostafiz023057@gmail.com",
        pass: "musi@023057"
    }
});
var algorithm = 'aes256';
var key = 'password';

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

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());




app.get('/api/users', function(req, res) {
    var userList = [];
    var callBackCount = 2;

    readDesign(userDoc, 'allUser', {"key": 1}, function(err, userDoc) {
        if (err) {
            console.log("Fail to pickup data from database for roll 1 !",extraRoll);
        }
        else {
            var users = userDoc.rows;

            users.forEach(function(user) {
                userList.push(user.value);
            });
            callBackCount--;
            sendData();
        }
    });

    readDesign(userDoc, 'userRollSTGroup', {"key": "2"}, function(err, rollDoc) {
        if (err) {
            console.log("Fail to pickup data from database for roll 2 !",err);
        }
        else {
            var extraRoll = rollDoc.rows[0].value;
            var stGroup = rollDoc.rows[1].value;
            extraRoll.forEach(function(ext) {
                userList.push(ext); /*User extra roll*/
            });

            stGroup.forEach(function(stg) {
                userList.push(stg); /*User extra roll*/
            });

            callBackCount--;
            sendData();
        }

    });

    function sendData() {
        if (callBackCount == 0) {
            res.send(userList);
        }
    }

});

app.get('/api/users/:id', function(req, res) {

    var userList = [];
    var callBackCount = 2;
    var userID = parseInt(req.params.id);

    readDesign(userDoc, 'userById', {"key": userID}, function(err, userDoc) {
        if (err) {
            console.log("Fail to pickup data from database !");
        }
        else {
            var users = userDoc.rows;

            users.forEach(function(user) {
                userList.push(user.value);
            });
            callBackCount--;
            sendData();
        }
    });



    function sendData() {
        // if (callBackCount == 0) {
        res.send(userList[0]);
        // }
    }

});

app.put('/api/users/:id', function(req, res) {
    var userData = req.body;

    readDesign(userDoc, 'userMaxId', {"key": 1}, function(err, userDoc) {
        if (err) {
            console.log("Fail to pickup data from database !");
        }
        else {
           
            var ids = [];
            var usersId = userDoc.rows;
            usersId.forEach(function(val) {
                if (!isNaN(val.value))
                    ids.push(val.value);
            });

            var id = Math.max.apply(Math, ids);
            if (typeof (id) == 'undefined' || id == null || id == '-Infinity')
            {
                id = 0;
            }
            
            if (userData.opType == "edit") {
                 var docID =userData._id;
                if (typeof (userData._id) == 'undefined' || userData._id == null )
                {
                   docID = "user_" + userData.id;
                }
                db.get(docID, function(err, exitDoc) {
                    if(!err){
                    exitDoc.email = userData.email;
                    exitDoc.extraRoll = userData.extraRoll;
                    exitDoc.name = userData.name;
                    exitDoc.phone = userData.phone;
                    exitDoc.studyGroup = userData.studyGroup;
                    exitDoc.activeStatus = userData.activeStatus;
                    saveUserDoc(userData._id, exitDoc, res);
                }
                });
            } else if (userData.opType == "save") {
                userData.id = id + 1;
                var docID = "user_" + userData.id;
                var salt = bcrypt.genSaltSync(10);
                var pwd = bcrypt.hashSync(userData.password, salt);
                var cipher = crypto.createCipher(algorithm, key);  
                var encrypted = cipher.update(userData.password, 'utf8', 'hex') + cipher.final('hex');

                userData.pwdCip = encrypted; 

                userData.password = pwd;
                saveUserDoc(docID, userData, res);
            } else {
                sendEmail(userData, res);
            }

        }
    })

});

var saveUserDoc = function(docID, userData, res) {
    db.save(docID, userData, function(err, userDoc) {
        if (err) {
            status = {status: false};
            console.log("Fail to save user data !");
        }
        else {
            status = {status: true};
            console.log("Save successful.");
        }
        res.send(status);
    });
}

var sendEmail = function(userData, res) {
    console.log(userData.email);
    var mail = {
        from: "Mostafizur <mostafiz023057@gmail.com>",
        to: userData.email,
        subject: "ilm Book Service",
        text: userData.textMessage,
        html: userData.textMessage
    }

    smtpTransport.sendMail(mail, function(error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }

        smtpTransport.close();
    });
    var status = true;

    res.send(status);
};

/**Read Design document**/
function readDesign(design, view, query, callback) {
    var vw = design + "/" + view; 
    db.view(vw, query, callback);
}
