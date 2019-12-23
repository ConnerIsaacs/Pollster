const express = require('express');
const socket = require('socket.io');
const mongoose = require("mongoose");
//require schema
//const newUser = require("./userschema");
var userSchema = {
    Username: String,
    Password: String,
    Age: String,
    Polls: [Number],
    userRValue: String,
    userGValue: String,
    userBValue: String
}
//require Poll Schema
var pollSchema = {
    pollID: Number,
    Question: String,
    PollCreator: String,
    Options: [{
        Option: String,
        Votes: Number
    }],
    totalVotes: Number
}

//const newPoll = require("./pollSchema");
//create app
const app = express();
const server = app.listen(8000);
const io = socket(server);

app.use(express.static("public"));

//User Database:mongodb://Cylthus:079815e23h54tp@ds239940.mlab.com:39940/pollsterusers
//Poll Database:mongodb://Cylthus:079815e23h54tp@ds115263.mlab.com:15263/pollsterpolls

//Connect to User Database
var conn = mongoose.createConnection('mongodb://Cylthus:079815e23h54tp@ds239940.mlab.com:39940/pollsterusers');
var newUser= conn.model('newUser', userSchema);


//Connect to Poll Database
var conn2 = mongoose.createConnection("mongodb://Cylthus:079815e23h54tp@ds115263.mlab.com:15263/pollsterpolls");
var poll = conn2.model("newPoll", pollSchema);

io.on('connection',(socket)=>{
    socket.on("colorSubmitClick", (data) => {
        console.log(data);
        newUser.findOneAndUpdate({ "Username": data.username, "Password": data.password }, { $set: { userRValue: data.userRValue, userGValue: data.userGValue, userBValue: data.userBValue } }, () => {
            console.log("hello");
        });
    });
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
            Age: age,
            Polls: [],
            userRValue:"212",
            userGValue: "120",
            userBValue: "114"
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

    socket.on("login", (data) => {
        var user = data.username;
        var password = data.password;
        newUser.findOne({ "Username": user, "Password": password }, (err, data) => {
            if (data) {
                var polls = [];
                poll.find({}, (err, poll) => {
                        poll.forEach((n) => {
                            var obj = {};
                            obj.PollCreator = n.PollCreator;
                            obj.Question = n.Question;
                            obj.pollID = n.pollID;
                            obj.totalVotes = n.totalVotes;
                            polls.push(obj);
                        });
                    socket.emit("login", {
                        polls: polls,
                        username: user,
                        password: password,
                        userRValue: data.userRValue,
                        userGValue: data.userGValue,
                        userBValue: data.userBValue
                    });
                })
            }
            else {
                socket.emit("invalidLogin");
            }
        });
    });

    socket.on("createPoll", (data) => {  
        //Create a new poll entity
        var pollID = Math.floor(Math.random() * 6000);
        var newpoll = new poll({
            //generate a unique ID for the poll
            Question: data.Question,
            PollCreator: data.PollCreator,
            Options: data.Options,
            totalVotes: 0,
        });
        while (1) {
            var found = false;
            poll.findOne({ "pollID": pollID }, (err, info) => {
                if (info) {
                    var found = true;
                    pollID = Math.floor(Math.random() * 6000);
                }
            })
            if (!found) break;
        }
        newpoll.pollID = pollID;
        newpoll.save();

        //Send back successful poll event to client
        socket.emit("pollCreated");
    });

    socket.on("pollButtonClicked", (data) => {
        newUser.findOne({ "Username": data.user }, (err, info) => {
            if (info.Polls.includes(parseInt(data.id))) {
                poll.findOne({ "pollID": data.id }, (err, m) => {
                    var options = {};
                    options.options = m.Options;
                    options.pollID = data.id;
                    socket.emit("responsePollButtonClickedAlreadyVoted", options);
                })
            }
            else {
                poll.findOne({ "pollID": data.id }, (err, m)  => {
                    var options = {};
                    options.options = m.Options;
                    options.pollID = data.id;
                    socket.emit("responsePollButtonClicked", options);
                })
            }
        })
    });

    socket.on("voteEvent", (data) => {
        console.log(data);
        poll.findOne({ "pollID": data.poll }, (err, info) => {
            for (var i = 0; i < info.Options.length; i++){
                if (info.Options[i].Option == data.option) {
                    info.Options[i].Votes++;
                    info.totalVotes++;
                    info.save(function (err) {
                        var options = {};
                        options.options = info.Options;
                        options.pollID = info.pollID;
                        socket.emit("responsePollButtonClickedAlreadyVoted", options);
                    });
                       
                }
            }
        })

        newUser.findOne({ "Username": data.user }, (err, info) => {
            info.Polls.push(data.poll);
            info.save();
        });

        
    });
    
})