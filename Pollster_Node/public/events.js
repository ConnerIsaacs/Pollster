var socket = io();
var options = {
    
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
   for(var i = 0; i < 5; i++){
        document.getElementById("options").insertAdjacentHTML('afterbegin', "<input class='input' id='title"+i+"'>");
   }
   document.getElementById("darkOverlay").addEventListener("click", overlayClick);
   document.getElementById("pollSubmit").addEventListener("click", pollSubmitClick);
});
function overlayClick(){
    document.getElementById("pollSubmit").removeEventListener(pollSubmitClick);
    var overlay = document.getElementById("darkOverlay").remove();
    document.getElementById("createPollForm").remove();
    
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
        Voters:[],
    }
    pollObject.PollCreator = user;
    pollObject.Question=document.getElementById("pollQuestion").value;
    for(var i = 4; i >= 0; i--){
        OptionsObject = {
            Option:"",
            Votes:0
        }
        optionValue = document.getElementById("title"+i).value
        if(optionValue != ""){
            OptionsObject.Option = optionValue;
            pollObject.Options.push(OptionsObject);
        }
    }
    socket.emit("createPoll", pollObject);

}
var user = "";
var password = "";
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
socket.on("login", (data)=>{
    user = data.username;
    password = data.password;
    document.getElementById("biggerFont").style.display = "block";
    document.getElementById("createOrLogout").style.display = "block";
    document.getElementById("username").innerHTML = user;
    document.getElementById("invalidLogin").style.display = "none";
    document.getElementById("body").style.animation = ".4s linear fadeOut";
    document.getElementById("body").addEventListener("animationend", fadeLoginForm);
});

socket.on("invalidLogin", ()=>{
    document.getElementById("invalidLogin").style.display = "block";
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
    removePolls();
    removePollInfo();
    document.getElementById("body").removeEventListener("animationend", fadeLoginForm);
    document.getElementById("right-content").style.display = "none";
    document.getElementById("body").style.animation = ".4s linear fadeIn";
    document.getElementById("body").style.display = "flex";
});



