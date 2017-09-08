const express = require('express'); //calling express pckg
const app = express(); //initializing express, saving in app

const router = express.Router();//tied to authentication.js
const config = require('./config/database');//importing DB module database.js
const mongoose = require('mongoose');//ES6 syntax var mongoose-->const mongoose
const path = require('path'); //for app.use(express) and the app.get functionality
const authentication = require('./routes/authentication')(router);//importing authen, and passing in router var
const bodyParser = require('body-parser');

const cors = require('cors');//this for cross-origin comm between express server and ang dev server, for reg

mongoose.Promise = global.Promise;//config issue 
mongoose.connect(config.uri, (err) => {
    if(err){
        console.log('Could NOT connect to database: ', err);
    }
    else{
        console.log('Connected to database: ' + config.db);
    }
});

//middleware
//cross origin too
app.use(cors({ //grabbing dev server
    origin: 'http://localhost:4200'
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/dist/'));//provide access to dist directory, connecting to production ready dist files
app.use('/authentication', authentication);//middleware for auth

//app.get('/', function(req, res){ //old syntax
//* means any route, same response
app.get('*', (req, res) => {//get is a req from user, we res w/ message
    //res.send('<h1>hello world!!!</h1>');
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));//looks similar html in ang ../index.html, but is built for efficiency&speed in dist, used ng build.
});

app.listen(8080, () => {
    console.log('Listening on port 8080'); //terminal message
});