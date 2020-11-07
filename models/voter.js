let mongoose = require('mongoose');

//Voter Schema
let voterSchema = mongoose.Schema({
  matno:{
    type: String,
    required: false
  },
  name:{
    type: String,
    required: false
  },

  pass:{
    type: String,
    required: false
  },
  donevote:{
    type: String,
    required: false
  }

});

let Voter = module.exports = mongoose.model('Voter', voterSchema);
