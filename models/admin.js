const mongoose = require('mongoose');
//admin voterSchema
const AdminSchema = mongoose.Schema({
name:{
  type: String,
  required: true
},
email:{
    type: String,
    required: true
},    
username:{
  type: String,
  required: true
},
password:{
  type: String,
  required: true
}});
//created a variable called Admin and exported it so it can be accessed from outside
const Admin = module.exports = mongoose.model('Admin', AdminSchema);
