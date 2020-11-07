const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const config = require('../config/database');
//Bring in voter model
let Voter = require('../models/voter');


//Add voter route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_voter', {
    title: 'Add Voter'
  });
});



//Add voter Post ROUTE
router.post('/add', function(req, res){
  const name = req.body.name;  
  const donevote = req.body.donevote;
  const matno = req.body.matno;
  const pass = req.body.pass;
  const pass2 = req.body.pass2;
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('matno', 'Matric Number is required').notEmpty();
  // req.checkBody('matno', 'matric number not found').equals(Voter.findOne({ matno: matno}));
  req.checkBody('pass', 'password is required').notEmpty();
  req.checkBody('pass2', 'passwords do not match').equals(req.body.pass);

  let errors = req.validationErrors();

    if(errors){
      res.render('add_voter', {
        errors:errors
      });
    }
    
    else{

      let errorsf = [];
      Voter.findOne({ matno: matno})
      .then(voter =>{
        if(voter){
          //student doesnt exists
          req.flash('success',' matric number already exists');
          errorsf.push({ msg: 'Username is already registered' });
          res.render('voter_signup',{
            errors:errors
          });
        }

        else{
          newVoter = new Voter({
            matno:matno,
            pass:pass,
            name:name,
            donevote:donevote
        });
        // hash password
        bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(newVoter.pass, salt, function(err, hash){
          if(err){
            console.log(err);
          }
          newVoter.pass = hash;
          //save password
          newVoter.save(function(err){
            if(err){
              console.log(err);
              return;
            } else {
              console.log('password added');
              console.log(newVoter.matno);
              console.log(newVoter.pass);              
              req.flash('success','You have added a new voter');
              res.redirect('/admins');
            }
          });
        });
      });
        }
      })
      
    }
});


//edit voter
router.get('/edit/:id', ensureAuthenticated, function(req, res){
Voter.findById(req.params.id, function(err, voter){
  console.log('clicked to edit '+voter.name);
 res.render('edit_voter',{
    voter:voter
  });
});
});

// update voter details
router.post('/edit/:id', function(req, res){
  let voter = {};
   voter.matno = req.body.matno;
   voter.name = req.body.name;
   /*voter.pass = req.body.pass;
   voter.pass2 = req.body.pass2; */
   voter.donevote = req.body.donevote;

   let query = {_id:req.params.id}

   Voter.update(query, voter, { overwrite: true }, function(err){
     if(err){
       console.log(err);
       return;
     }else {
       console.log('changed to');
       console.log(voter);
      req.flash('success','Voter Modified');
       res.redirect('/admins');
     }
   });
 });

// Delete voter
router.delete('/:id', function(req, res){
  if(!req.user._id){
  res.status(500).send();
}

let query = {_id:req.params.id}

  Voter.remove(query, function(err){
    if(err){
      console.log(err);
  }
  res.send('Deleted it')

  });
});

// Register password
router.get('/signup', function(req, res){
  res.render('voter_signup');
});

//register process
router.post('/signup', function(req, res){

 
  const matno = req.body.matno;
  const pass = req.body.pass;
  const pass2 = req.body.pass2;

  req.checkBody('matno', 'Matric Number is required').notEmpty();
  // req.checkBody('matno', 'matric number not found').equals(Voter.findOne({ matno: matno}));
  req.checkBody('pass', 'password is required').notEmpty();
  req.checkBody('pass2', 'passwords do not match').equals(req.body.pass);

  let errors = req.validationErrors();

    if(errors){
      res.render('voter_signup', {
        errors:errors
      });
    }
    
    else{

      let errorsf = [];
      Voter.findOne({ matno: matno})
      .then(voter =>{
        if(!voter){
          //student doesnt exists
          req.flash('success',' matric number not found, Please pay dues');
          errorsf.push({ msg: 'Username is already registered' });
          res.render('voter_signup',{
            errors:errors
          });
        }

        else{
          let voter={};
          voter.matno = req.body.matno;
          // voter.name = req.body.name;
          voter.pass = req.body.pass;
          voter.pass2 = req.body.pass2; 
          // voter.donevote = req.body.donevote;
       
          let query = {_id:req.params.id}
        
          Voter.update(query, voter, function(err){
            if(err){
              console.log(err);
              return;
            }else {
              console.log('password updated for ' +voter.matno);             
             req.flash('success','You can login');
              res.redirect('/voters/login');
            }
          });
        }
      })
      
    }
});

// starte

// passport.use('voter', new LocalStrategy(function(matno, done){
//   var query = {matno: matno};
//   Voter.findOne(query, function(err, voter){
//       if(err) throw err;
//       if(!voter){
//           console.log("no matno found")
//             return done(null, false);         
//                 }
//      /* bcrypt.compare(password,student.password, function(err, isMatch){
//           if(err) throw err;
//           if(isMatch)
//               return done(null, student);
//           else
//               return done(null,false);
//       }) */
//   })
// })) 
// voter login form
router.get('/login', function(req, res){
res.render('login');
});

//login process
router.post('/login', function(req, res, next){

  passport.authenticate('user',
  { successRedirect: '/poll',
   failureRedirect: '/voters/login',
  failureFlash: true
   })(req, res, next);
});



//get single voters
router.get('/:id', ensureAuthenticated, function(req, res){
Voter.findById(req.params.id, function(err, voter){
  console.log(voter);
 res.render('voter',{
    voter:voter
  });
});
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
// to make routes accesible from outside
module.exports = router;
