const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CandidateSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  post: {
    type: String,
    required: true
  }
});

// Create collection and add schema
const Candidate = mongoose.model('Candidate', CandidateSchema);

module.exports = Candidate;
