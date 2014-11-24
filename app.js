var express = require('express');
var stylus = require('stylus');
var nib = require('nib');
var hbs = require('hbs');
var app = express();
var routes = require('./routes');
var users = require('./source/model/users');
var login = require('./source/model/login');
var library = require('./source/model/library');


var DEV_PATH = '/source';

app.engine('html', hbs.__express);
app.set('view engine', 'html');
app.set('views', __dirname + DEV_PATH);
app.use(express.static(__dirname + DEV_PATH));
app.use(routes);
app.use(users);
app.use(login);
app.use(library);


hbs.registerHelper('json', function(context) {
    return JSON.stringify(context);
});

var PORT = 3000;
app.listen(PORT);
console.log("http://localhost:" + PORT + " [" + app.settings.env + "]");

process.on('uncaughtException', function(err) {
    console.error("FATAL ERROR: " + err.message);
    console.error('Stack: ' + err.stack);
    console.error("Shuting down app...");
    process.exit(1);
});

routes.initDb();