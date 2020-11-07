const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const Pusher = require('pusher');

const keys = require('../config/keys');

var pusher = new Pusher({
  appId: keys.pusherAppId,
  key: keys.pusherKey,
  secret: keys.pusherSecret,
  cluster: keys.pusherCluster,
  encrypted: keys.pusherEncrypted
});

router.get('/', (req, res) => {
  Vote.find({}, function(err, votes){
    if(err){
      console.log(err);
    }else{res.render('cast_vote', {
      votes:votes
    });
  }
  });
});
router.get('/work', (req, res) => {
  Vote.find().then(votes => res.json({ success: true, votes: votes }));
});


router.post('/work', (req, res) => {
  const newVote = {
    os: req.body.os,
    points: 1
  };

  new Vote(newVote).save().then(vote => {
    pusher.trigger('os-poll', 'os-vote', {
      points: parseInt(vote.points),
      os: vote.os
    });

    return res.json({ success: true, message: 'Thank you for voting' });
  });
});

router.get('/result', (req, res) => {
  Vote.find({}, function(err, votes){
    if(err){
      console.log(err);
    }else{res.render('results', {
      votes:votes
    });
  }
  });
});

module.exports = router;
