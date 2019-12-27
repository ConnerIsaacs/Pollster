
for(var i = 1; i < 100; i++){
	document.getElementById("age").innerHTML += "<option value=''>"+i.toString()+"</option>";
}
document.getElementById("registerAccountClick").addEventListener("click", function(){
	document.getElementById("loginForm").style.display = "none";
	document.getElementById("registerForm").style.display = "flex";
});
document.getElementById("loginAccountClick").addEventListener("click", function(){
	document.getElementById("loginForm").style.display = "flex";
	document.getElementById("registerForm").style.display = "none";
});
 
