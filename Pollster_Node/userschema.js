//require mongoose
const mongoose = require("mongoose");

//create Schema
const Schema = mongoose.Schema;

//Use schema to create data structure
var data = new Schema({
  Username: String,
  Password: String,
  Age: String
},{timestamps:true});

//create model
const model = mongoose.model("newUser",data);

//export model
module.exports=model;