const mongoose = require('mongoose');
const keys = require('./keys');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose
  .connect(keys.mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));
