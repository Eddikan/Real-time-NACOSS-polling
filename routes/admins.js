const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Bring in models
let Admin = require('../models/admin');
let Voter = require('../models/voter');


 //Add Admin ROUTE
 router.get('/', function(req, res){
  Voter.find({}, function(err, voters){
    if(err){
      console.log(err);
    }else{
  res.render('admin', {
    title: 'Welcome Admin',
    voters: voters
  });
}
  });
});

// Register form
router.get('/add', function(req, res){
  res.render('add_admin', {
    title: 'Add Admin'
  });
});

//add admin register process
router.post('/add', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('add_admin', {
      errors:errors
    });
  } else {
    let newAdmin = new Admin({
      name:name,
      email:email,
      username:username,
      password:password
    });
    // hash password
    bcrypt.genSalt(10, function(err, salt){
    bcrypt.hash(newAdmin.password, salt, function(err, hash){
      if(err){
        console.log(err);
      }
      newAdmin.password = hash;
      newAdmin.save(function(err){
        if(err){
          console.log(err);
          return;
        } else {
          req.flash('success','You have registered a new admin who can log in');
          res.redirect('/admins/login');
        }
      });
    });
  });
}
});
// login form
router.get('/login', function(req, res){
  res.render('admin_login');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('adminLocal', {
    successRedirect:'/admins',
    failureRedirect:'/admins/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/admins/login');
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/admins/login');
  }
}
module.exports= router;
