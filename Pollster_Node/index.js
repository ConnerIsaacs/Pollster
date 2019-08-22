const express = require('express');
const socket = require('socket.io');
const mongoose = require("mongoose");
//require schema
const newUser = require("./userschema");

//require Poll Schema
const newPoll = require("./pollSchema");
//create app
const app = express();
const server = app.listen(8000);
const io = socket(server);

app.use(express.static("public"));

//User Database:mongodb://Cylthus:079815e23h54tp@ds239940.mlab.com:39940/pollsterusers
//Poll Database:mongodb://Cylthus:079815e23h54tp@ds115263.mlab.com:15263/pollsterpolls
//Connect to User database
mongoose.connect(process.env.MONGODB_URI="mongodb://Cylthus:079815e23h54tp@ds239940.mlab.com:39940/pollsterusers");

io.on('connection',(socket)=>{
 
    socket.on("register",(data)=>{
      var username = data.username;
      var password = data.password;
      var confirmPassword = data.confirmPassword;
      var age = data.age;
      var userNameExists = false;
      if(password.length<6){
          socket.emit("passwordToShort");
      }
      else{
          socket.emit("passwordLongEnough");
        var person = new newUser({
            Username: username,
            Password: password,
            Age: age
        });
        newUser.findOne({"Username":username}, (err,data)=>{
            if(data){
                console.log("user already exists");
                socket.emit("UserExists");
            }
            else{
                socket.emit("UserFine");
                if(password === confirmPassword){
                    socket.emit("PasswordsOK");
                    socket.emit("registerSuccess");
                    person.save();
                    console.log("User saved");
                }
                else {
                    socket.emit("NonMatchPasswords");
                }
            
            }
        });
      }
    });

    socket.on("login", (data)=>{
        var user = data.username;
        var password = data.password;
        newUser.findOne({"Username":user, "Password":password}, (err,data)=>{
            if(data){
                socket.emit("login", {
                    username:user,
                    password:password
                });
            }
            else{
                socket.emit("invalidLogin");
            }
        });
    })
})