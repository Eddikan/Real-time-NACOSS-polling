const LocalStrategy = require('passport-local').Strategy;
const Voter = require('../models/voter');
const Admin = require('../models/admin');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){

// // use two LocalStrategies, registered under user and company names
// passport.use('user', new LocalStrategy(
//   function(username, password, done) {
//     User.findOne(/* ... */)
//   }
// ));

  //////////////////////////////////////////
  // Local Strategy
  passport.use('adminLocal', new LocalStrategy(function(username, password, done){
    // Match Username
    let query = {username:username};
    Admin.findOne(query, function(err, admin){
      if(err) throw err;
      if(!admin){
        return done(null, false, {message: 'No user found'});
      }

      // Match Password
      bcrypt.compare(password, admin.password, function(err, isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null, admin);
        } else {
          return done(null, false, {message: 'Wrong password'});
        }
      });
    });
  }
  ));

  var localOptions = {
    usernameField: 'matno',
    passwordField: 'pass'
  }
  passport.use('user', new LocalStrategy(localOptions,
    function(matno, pass, done) {
      Voter.findOne({
        matno: matno
      }, function(err, voter){
        if(err){
          return done(err);
        }
        if(!voter){
          return done(null, false, {message: 'matric no not found'});
        }

        //match password
        bcrypt.compare(pass, voter.pass, function(err, isMatch){
          if(err){
            return done(err);
          }
          if(isMatch){
            return done(null, voter);
          }else {
            return done(null, false, {message: 'Wrong voter password'});
          }
        });
      });
    }
  ));



  passport.serializeUser(function(user, done) { 
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    if(user!=null)
      done(null,user);
  });

}
