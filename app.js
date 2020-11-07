const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const cors = require('cors');


//db config
require('./config/database');

// mongoose.connect(config.database);
// let db = mongoose.connection;

// //check connection
// db.once('open', function(){
// console.log('connected to the database on MongoDb');

// });

// //Check for db errors
// db.on('error', function(err){
//   console.log(err);

// });
// init App
const app = express();
const poll = require('./routes/poll')

//Bring in models
let Voter = require('./models/voter');
//Bring in Admin model
let Admin = require('./models/admin');

// Load View Engine
app.set('views', path.join(__dirname, 'public') );
app.set('view engine', 'pug');

// body-parser middleware
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Enable CORS
app.use(cors()); 

//setPublic Folder
app.use(express.static(path.join(__dirname, 'views')));

//Express Session middleware
app.use(session({
  secret: 'Eddy is the goat',
  resave: true,
  saveUninitialized: true,
//  cookie: { secure: true }
}));

//Express message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

//Home Route
app.get('/',function(req, res){
//  passing in voter into the function from the query into the view

      res.render('index', {
        title: 'Welcome',
        //voters: voters
      });
    });

   

// Route Files
let voters= require('./routes/voters');
let admins= require('./routes/admins');
app.use('/voters', voters);
app.use('/admins', admins);
app.use('/poll', poll);
//start Server
const port = 4040;

// Start server
app.listen(port, () => console.log(`Server started on port ${port}`));


// app.listen(3000, function(){
//   console.log('server is running on port 3000...');

// });
