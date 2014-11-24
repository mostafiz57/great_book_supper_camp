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
    extended: true
}));
app.use(bodyParser.json());

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


app.post('/api/login', function(req, res) {
    var userData = req.body;

    readDesign(userDoc,"userByMail",{key:userData.username},function(err,doc){
        if(err){
            console.log(err);
        }
        else{
            var dbPassword = doc.rows[0].value;
             bcrypt.compare(userData.password, dbPassword, function(err, result) {
                if(err){ 
                    console.log(err);
                }
                else{
                    console.log('Login Result:',result);
                    res.send(result);
                }
             });
        }
    });

});

app.post('/api/getPassword',function(req,res){
     var userData = req.body;

    readDesign(userDoc,"encriptPwdByMail",{key:userData.email},function(err,doc){
            if(err){
                console.log(err);
            }
            else{
                var dbPassword = doc.rows[0].value;
                console.log("encript value ----",dbPassword);
                var decipher = crypto.createDecipher(algorithm, key);
                var decryptedPwd = decipher.update(dbPassword, 'hex', 'utf8') + decipher.final('utf8');
                userData.textMessage="Your ilm book password is "+decryptedPwd+"";
                sendEmail(userData, res);
            }
        });
});

var readDesign = function (design, view, query, callback) {
    var vw = design + "/" + view; 
    db.view(vw, query, callback);
}

var sendEmail = function(userData, res) {
    console.log(userData.email);
    var mail = {
        from: "Mostafizur <mostafiz023057@gmail.com>",
        to: userData.email,
        subject: "ilm Book Password",
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
