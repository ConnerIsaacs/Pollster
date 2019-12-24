var socket = io();
var options = {
    userRValue: "212",
    userGValue: "120",
    userBValue: "114",
    doughnutChart: true,
    barChart: false,
};
//Get DOM elements
const loginBtn = document.getElementById("login");
const registerBtn = document.getElementById("register");

var loginUserField = document.getElementById("usernameField");
var loginPassword = document.getElementById("password");
var x = document.getElementById("header").offsetHeight;
var y = document.getElementById("footer").offsetHeight;
document.getElementById("polls").style.height = "calc(100% - " + (x+y) + "px)";
document.getElementById("right-content").style.height = "calc(100% - " + (x+y) + "px)";

function updateUserColor() {
    options.userColor = "rgb(" + options.userRValue + "," + options.userGValue + "," + options.userBValue + ")";
}

var hovers = document.getElementsByClassName("changeHoverColors");

function addSearchBar() {
    document.getElementById("polls").insertAdjacentHTML("afterbegin", "<div id='searchPolls'><input type='text' id='search' placeholder='Search Polls'/></div>");
}
function resizePolls(){
    if(parseInt(window.innerWidth)>650){
        var x = document.getElementById("header").offsetHeight;
        var y = document.getElementById("footer").offsetHeight;
        document.getElementById("polls").style.height = "calc(100% - " + (x+y) + "px)";
        document.getElementById("right-content").style.height = "calc(100% - " + (x+y) + "px)";
        document.getElementById("polls").style.width = "30%";
    }
    else{
        document.getElementById("polls").style.width = "100%";
    }
}
document.getElementById("createPollButton").addEventListener("click", ()=>{
   document.body.insertAdjacentHTML('afterbegin', "<div id='darkOverlay'></div>");
   document.body.insertAdjacentHTML('afterbegin', "<div id='createPollForm'><h3 id='creatingPoll'>Create a Poll</h3><input class='input' id='pollQuestion' placeHolder='Poll question here'><div id='options'></div></div>");
   document.getElementById("options").insertAdjacentHTML('afterbegin', "<div id='pollSubmit'>Submit</div>");
   var x = 5;
   for(var i = 0; i < 5; i++, x--){
        document.getElementById("options").insertAdjacentHTML('afterbegin', "<input class='input' id='title"+i+"' placeHolder='Option "+x+"'>");
   }
    //Adjust submit button to be the color of user color
   document.getElementById("pollSubmit").style.backgroundColor = options.userColor;
   document.getElementById("darkOverlay").addEventListener("click", overlayClick);
   document.getElementById("pollSubmit").addEventListener("click", pollSubmitClick);

    //Reflect text to be user's preferred color
   document.getElementById("creatingPoll").style.color = options.userColor;
});

//When "options" is clicked, create options form
document.getElementById("settings").addEventListener("click", () => {

    //Add dark overlay
    document.body.insertAdjacentHTML('afterbegin', "<div id='darkOverlay'></div>");

    //Add heading and color selection container
    document.body.insertAdjacentHTML('afterbegin', "<div id='optionsForm'><h3>User Options</h3><div id='colorSelection'></div></div>");

    //function to create sliders and their corresponding values
    addSliderContainers();

    //add color selection preview heading and color selection preview
    document.getElementById("colorSelection").insertAdjacentHTML('beforeend', "<h3 id='colorPreviewHeading'> Color Preview: </h3>");
    document.getElementById("colorSelection").insertAdjacentHTML('beforeend', "<div id='colorPreview'></div>");

    //set background color of selection preview to user color
    document.getElementById("colorPreview").style.backgroundColor = options.userColor;

    //add submit button to color selection container
    document.getElementById("colorSelection").insertAdjacentHTML('beforeend', "<div id='colorSubmit'>Submit</div>");

    //Adjust submit button to be the color of user color
    document.getElementById("colorSubmit").style.backgroundColor = options.userColor;

    document.getElementById("colorSubmit").addEventListener("click", colorSubmitClick);
    document.getElementById("darkOverlay").addEventListener("click", overlayClick);

    document.getElementById("optionsForm").style.color = options.userColor;
});

function colorSubmitClick() {
    //Update local options object to new user preferred color
    options.userRValue = document.getElementById("RVALUE").value;
    options.userGValue = document.getElementById("GVALUE").value;
    options.userBValue = document.getElementById("BVALUE").value;
    updateUserColor();

    var a = document.getElementsByClassName("changeColors");
    for (var i = 0; i < a.length; i++) {
        a[i].style.color = options.userColor;
    }

    for (var i = 0; i < particles.length; i++) {
        particles[i].color = options.userColor;
    }

    document.getElementById("right-contentTitle").style.color = options.userColor;
    overlayClick();

    socket.emit("colorSubmitClick", {
        username: localStorage.getItem("user"),
        password: localStorage.getItem("password"),
        userRValue: options.userRValue,
        userGValue: options.userGValue,
        userBValue: options.userBValue
    });

    socket.emit("pollButtonClicked", { id: localStorage.getItem("currentPoll"), user: localStorage.getItem("user") });
}
function addSliderContainers() {
    var colorSelection = document.getElementById("colorSelection");
    var Rslider, Bslider, Gslider;

    //Add divs for the different sliders + their numbers
    colorSelection.insertAdjacentHTML('afterbegin', "<div id='Bslider'></div>");
    colorSelection.insertAdjacentHTML('afterbegin', "<div id='Gslider'></div>");
    colorSelection.insertAdjacentHTML('afterbegin', "<div id='Rslider'></div>");

    //Assign divs to variables
    Rslider = document.getElementById("Rslider");
    Bslider = document.getElementById("Bslider");
    Gslider = document.getElementById("Gslider");

    //Add actual sliders
    Gslider.insertAdjacentHTML('afterbegin', "<div class='slidecontainer'><input type='range' min='100' max='255' value='" + options.userGValue + "' class='slider' id='GVALUE' oninput='updateVal(this.id)' onchange='updateVal(this.id)'></div>");
    Bslider.insertAdjacentHTML('afterbegin', "<div class='slidecontainer'><input type='range' min='100' max='255' value='" + options.userBValue + "' class='slider' id='BVALUE' oninput='updateVal(this.id)' onchange='updateVal(this.id)'></div>");
    Rslider.insertAdjacentHTML('afterbegin', "<div class='slidecontainer'><input type='range' min='100' max='255' value='" + options.userRValue + "' class='slider' id='RVALUE' oninput='updateVal(this.id)' onchange='updateVal(this.id)'></div>");

    //Add numbers to reflect value of sliders
    Gslider.insertAdjacentHTML("beforeend", "<div class='slidevalue'><p id='Gvalue'>"+options.userGValue+"</p></div>");
    Bslider.insertAdjacentHTML("beforeend", "<div class='slidevalue'><p id='Bvalue'>" + options.userBValue + "</p></div>");
    Rslider.insertAdjacentHTML("beforeend", "<div class='slidevalue'><p id='Rvalue'>" + options.userRValue + "</p></div>");
}
function updateVal(n) {
    document.getElementById(n.substring(0, 1) + "value").innerText = document.getElementById(n).value;
    rvalue = document.getElementById('RVALUE').value;
    gvalue = document.getElementById('GVALUE').value;
    bvalue = document.getElementById('BVALUE').value;
    document.getElementById('colorPreview').style.backgroundColor = "rgb(" + rvalue + ", " + gvalue + ", " + bvalue + ")";
}
function overlayClick() {
    var createPollFormVar = false;
    var OptionsFormVar = false;
    //Determine which forms are up
    if(document.getElementById("pollSubmit")!=null){
        createPollFormVar = true;
    }
    if(document.getElementById("optionsForm")!=null){
        OptionsFormVar = true;
    }
    //If createpollform is up, remove the event listener and remove it
    if (createPollFormVar) {
        document.getElementById("pollSubmit").removeEventListener("click", pollSubmitClick);
        document.getElementById("createPollForm").remove();
    }
    //If optionsform is up, remove event listener and remove it
    if (OptionsFormVar) {
        document.getElementById("optionsForm").removeEventListener("click", colorSubmitClick);
        document.getElementById("optionsForm").remove();
    }
    //remove the overlay
    var overlay = document.getElementById("darkOverlay").remove();  
}

socket.on("UserExists", ()=>{
    document.getElementById("userExistsAlert").style.display = "block";
});
socket.on("UserFine", ()=>{
    document.getElementById("userExistsAlert").style.display = "none";
});
socket.on("passwordToShort",()=>{
    document.getElementById("passwordToShortAlert").style.display = "block";
});
socket.on("passwordLongEnough",()=>{
    document.getElementById("passwordToShortAlert").style.display = "none";
});
socket.on("NonMatchPasswords", ()=>{
    document.getElementById("nonMatchPassword").style.display = "block";
});
socket.on("PasswordsOK", ()=>{
    document.getElementById("nonMatchPassword").style.display = "none";
});
socket.on("registerSuccess", ()=>{
    document.getElementById("successfulSignup").style.display = "block";
});

window.addEventListener("resize", resizePolls);
registerBtn.addEventListener("click",()=>{
    var registerUserField = document.getElementById("registerusernameField").value;
    var registerPassword = document.getElementById("registerpassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var age = document.getElementById("age");
    var text = age.options[age.selectedIndex].text;
    socket.emit("register", {
        username: registerUserField,
        password: registerPassword,
        confirmPassword: confirmPassword,
        age: text
    });
})
function pollSubmitClick(){
    var pollObject = {
        Question:"",
        PollCreator:"",
        Options:[],
    }
    pollObject.PollCreator = localStorage.getItem("user");
    pollObject.Question=document.getElementById("pollQuestion").value;
    for(var i = 4; i >= 0; i--){
        var OptionsObject = {
            Option:"",
            Votes:0
        }
        var optionValue = document.getElementById("title"+i).value
        if(optionValue != ""){
            OptionsObject.Option = optionValue;
            pollObject.Options.push(OptionsObject);
        }
        
    }
    console.log(pollObject);
    socket.emit("createPoll", pollObject);

}

function pollsInEnd(){
        document.getElementById("body").style.display = "none";
        document.getElementById("right-content").style.display = "flex";
        document.getElementById("pollInfo").style.animation = ".4s linear fadeIn forwards";
        document.getElementById("polls").style.width = "30%";
        document.getElementById("polls").style.animation = "";
}
function fadeLoginForm(){
    document.getElementById("body").style.display = "none";
    document.getElementById("polls").style.display = "block";
    document.getElementById("polls").addEventListener("animationend", pollsInEnd());
    document.getElementById("polls").style.animation = ".2s linear expandwidth forwards";
}

function removePolls(){
    document.getElementById("polls").style.width = "0%";
    document.getElementById("polls").style.diplay = "none";
    document.getElementById("polls").style.animation = "none";
}
function removePollInfo(){
    document.getElementById("pollInfo").style.opacity = "0";
    document.getElementById("pollInfo").style.animation = "";
}

//Calculate 5 darker tints of user's preferred color for use in charts
function getChartColors() {
    var colors = [];
    for (var i = 0; i < 5; i++) {
            var RHex = parseInt(options.userRValue - (20 * i)).toString(16);
            var GHex = parseInt(options.userGValue - (20 * i)).toString(16);
            var BHex = parseInt(options.userBValue-(20*i)).toString(16);

        colors.push("#" + RHex + GHex + BHex);
    }
    return colors;
}

socket.on("login", (data) =>{
   
    var a = document.getElementById("polls");
    //Set username and password
    localStorage.setItem("user", data.username);
    localStorage.setItem("password", data.password);

    //Get user's preferred color setup
    options.userRValue = data.userRValue;
    options.userGValue = data.userGValue;
    options.userBValue = data.userBValue;
    updateUserColor();
    var m = document.getElementsByClassName("changeColors");

    //Change colors of items on header to user's preferred color
    for (var i = 0; i < m.length; i++) {
        m[i].style.color = options.userColor;
    }
    addSearchBar();
    //Add all the polls to the left side
    for (var i = 0; i < data.polls.length; i++) {
        a.insertAdjacentHTML("beforeend", "<div class='pollButton' id='" + data.polls[i].pollID + "'><p id='pollName'>" + data.polls[i].Question + "</p><p>Votes: " + data.polls[i].totalVotes + "</p><p id='author'>Author: " + data.polls[i].PollCreator + "</p></div>");
    }
    //REcolor particles to user's preferred color
    for (var i = 0; i < particles.length; i++) {
        particles[i].color = options.userColor;
    }

    document.querySelectorAll('.pollButton').forEach(function (el) {
        el.addEventListener("click", function () {
            console.log(localStorage.getItem("user"));
            socket.emit("pollButtonClicked", { id: this.id, user:localStorage.getItem("user") });
        })
    })

    document.getElementById("right-contentTitle").style.color = options.userColor;
    document.getElementById("biggerFont").style.display = "block";
    document.getElementById("createOrLogout").style.display = "block";
    document.getElementById("settings").style.display = "block";
    document.getElementById("username").innerHTML = localStorage.getItem("user");
    document.getElementById("invalidLogin").style.display = "none";
    document.getElementById("body").style.animation = ".4s linear fadeOut";
    document.getElementById("body").addEventListener("animationend", fadeLoginForm);

});

socket.on("invalidLogin", ()=>{
    document.getElementById("invalidLogin").style.display = "block";
});

socket.on("pollCreated", () => {
    overlayClick();
    document.getElementById("polls").innerHTML = "";
    socket.emit("login", {
        username: localStorage.getItem("user"),
        password: localStorage.getItem("password")
    });
})

socket.on("responsePollButtonClicked", (data) => {
    console.log(data);
    localStorage.setItem("currentPoll", data.pollID);
    document.getElementById("pollInfo").innerHTML = "";
    document.getElementById("pollInfo").innerHTML += "<h2 id='right-contentTitle'>Vote to see the results!</h2>";
    var div = document.getElementById("pollInfo");
    for (var i = 0; i < data.options.length; i++) {
        div.insertAdjacentHTML("beforeend", "<div class='voteButton' id='" + data.options[i].Option+"'><p>"+ data.options[i].Option+"</p></div>");
    }

    document.querySelectorAll('.voteButton').forEach(function (el) {
        el.addEventListener("click", function () {
            socket.emit("voteEvent", { user: localStorage.getItem("user"), option: this.id, poll: localStorage.getItem("currentPoll") });
        })
    })
    document.getElementById("right-contentTitle").style.color = options.userColor;
})

socket.on("responsePollButtonClickedAlreadyVoted", (data) => {
    localStorage.setItem("currentPoll", data.pollID);
    document.getElementById("pollInfo").innerHTML = "";
    document.getElementById("pollInfo").innerHTML += "<h2 id='right-contentTitle'>You've voted on this poll, here are the results!</h2>";
    var arr = [];
    var labels = [];
    for (var i = 0; i < data.options.length; i++) {
        if (data.options[i].Votes > 0) {
            arr.push(data.options[i].Votes);
            labels.push(data.options[i].Option);
        }
    }
    document.getElementById("pollInfo").innerHTML += "<canvas width='100%' height='50%' id='doughnut-chart'></canvas>"
    getChartColors();
    new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
            labels: [...labels],
            datasets: [
              {
                  label: "Population (millions)",
                  backgroundColor: getChartColors(),
                  data: [...arr]
              }
            ]
        },
        options: {
            title: {
                display: true,
                text: 'Poll Results'
            }
        }
    });
    document.getElementById("right-contentTitle").style.color = options.userColor;
});

document.getElementById("login").addEventListener("click", ()=>{
        var tempUser = document.getElementById("usernameField").value;
        var tempPassword = document.getElementById("password").value;
        socket.emit("login", {
            username: tempUser,
            password: tempPassword
        });
})

document.getElementById("logoutButton").addEventListener("click", ()=>{
    user= "";
    password = "";
    document.getElementById("biggerFont").style.display = "none";
    document.getElementById("createOrLogout").style.display = "none";
    document.getElementById("settings").style.display = "none";
    removePolls();
    removePollInfo();
    document.getElementById("body").removeEventListener("animationend", fadeLoginForm);
    document.getElementById("right-content").style.display = "none";
    document.getElementById("body").style.animation = ".4s linear fadeIn";
    document.getElementById("body").style.display = "flex";
    document.getElementById("polls").innerHTML = "";

    options.userRValue = "212";
    options.userGValue = "120";
    options.userBValue = "114";
    updateUserColor();
    for (var i = 0; i < particles.length; i++) {
        particles[i].color = options.userColor;
    }
    document.getElementById("pollInfo").innerHTML = "";
    document.getElementById("pollInfo").insertAdjacentHTML("afterbegin", "<h2 id='right-contentTitle'>Click on a poll to vote / see the results!</h2>");

});



/*---------------------------------------BACKGROUND PARTICLES------------------------*/
//form userColor string
updateUserColor();
var FPS = 30;
var width = window.innerWidth;
var NUM_PARTICLES = 40;
var height = window.innerHeight - document.getElementById("header").offsetHeight - document.getElementById("footer").offsetHeight;
var ctx;

document.getElementById("canvas").style.marginTop = document.getElementById("header").offsetHeight + "px";

var particles = []; //Holds the particles


var Particle = function (x, y) {
    if (x == 0) {
        this.x = Math.random() * width;
    }
    else {
        this.x = x;
    }
    if (y == 0) {
        this.y = Math.random() * height;
    }
    else {
        this.y = y;
    }

    this.rad = 2 + (Math.random());
    this.speed = .5;
    this.color = options.userColor;
    this.angle = Math.round(Math.random() * Math.PI * 2);
    this.render = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        for (var i = 0; i < NUM_PARTICLES; i++) {
            var p2 = particles[i];
            var dx = p2.x - this.x;
            var dy = p2.y - this.y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            var opacity = 1 - distance / 150;
            if (opacity > 0) {
                ctx.lineWidth = opacity;
                ctx.strokeStyle = options.userColor;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.globalAlpha = 1;

        }
    };

    this.move = function () {
        if (this.x >= width || this.y >= height) {
            this.angle += 180;
        }
        else if (this.x <= 0 || this.y <= 0) {
            this.angle += 180;
        }
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
    };
};

var render = function () {
    width = window.innerWidth;
    height = window.innerHeight - document.getElementById("header").offsetHeight - document.getElementById("footer").offsetHeight;
    canvas.width = width;
    canvas.height = height;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
    for (var i = 0; i < NUM_PARTICLES; i++) {
        var p = particles[i];
        p.render();
        p.move();
    }
};

window.onload = function () {
    var canvas = document.getElementById('canvas');
    if (!canvas.getContext) {
        alert("Your browser doesn't support html5");
        return;
    }
    ctx = canvas.getContext("2d");
    for (var i = 0; i < NUM_PARTICLES; i++) {
        particles.push(new Particle(0, 0));
    }
    setInterval(render, 1000 / FPS);
    canvas.addEventListener("click", function () {
        x = event.clientX;
        y = event.clientY - document.getElementById("header").offsetHeight;
        NUM_PARTICLES++;
        particles.push(new Particle(x, y));
    });

    canvas.addEventListener('contextmenu', function (ev) {
        ev.preventDefault();
        NUM_PARTICLES--;
        particles.pop();
        return false;
    }, false);
};
