//require mongoose
const mongoose = require("mongoose");

//create Schema
const Schema = mongoose.Schema;

//Use schema to create data structure
var data = new Schema({
  Question:String,
  PollCreator:String,
  Options:[{
    Option:String,
    Votes:Number
  }],
},{timestamps:true});

//create model
const model = mongoose.model("newPoll", data);

//export model
module.exports=model;