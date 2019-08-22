
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
 
var FPS = 30;
var width = window.innerWidth;
var NUM_PARTICLES = 40;
var height = window.innerHeight-document.getElementById("header").offsetHeight-document.getElementById("footer").offsetHeight;
var ctx;

document.getElementById("canvas").style.marginTop = document.getElementById("header").offsetHeight+"px";
           
var particles = []; //Holds the particles
             
          
var Particle = function(x,y) {
    if(x==0){
        this.x = Math.random()*width;
	}
	else{
		this.x = x;
	}
	if(y == 0){
        this.y = Math.random()*height;
	}
	else{
		this.y = y;
	}
               
    this.rad = 2+(Math.random());
    this.speed = .5;
    this.color = "rgba(255,95,103,1)";
    this.angle = Math.round(Math.random()*Math.PI*2);
    this.render = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rad, 2*Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
                      
        for(var i=0; i<NUM_PARTICLES; i++) {
            var p2 = particles[i];                        
            var dx =  p2.x - this.x;
            var dy =  p2.y - this.y;
            var distance = Math.sqrt(dx*dx + dy*dy);
            var opacity = 1 - distance/150;
            if(opacity>0){
				ctx.lineWidth = opacity;
				ctx.strokeStyle = "rgba(255,95,103, .5)";
				ctx.beginPath();
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(p2.x, p2.y);
				ctx.closePath();
				ctx.stroke();
			}
			ctx.globalAlpha = 1;
                        
        }
    };
                 
    this.move = function(){
		if(this.x >= width || this.y >= height){
			this.angle += 180;
		}
		else if(this.x <= 0 || this.y <= 0){
			this.angle += 180;
		}
	    this.x += this.speed*Math.cos(this.angle);
		this.y += this.speed*Math.sin(this.angle);
    };
};            
            
var render = function() {
    width = window.innerWidth;
	height = window.innerHeight-document.getElementById("header").offsetHeight-document.getElementById("footer").offsetHeight;
	canvas.width = width;
	canvas.height = height;
	ctx.fillStyle="white";
	ctx.fillRect(0,0,width,height);
    for(var i=0; i<NUM_PARTICLES; i++){
        var p = particles[i];
        p.render();
        p.move();
    }
};
            
window.onload = function() {
    var canvas = document.getElementById('canvas');
    if(!canvas.getContext) {
        alert("Your browser doesn't support html5");
        return;
    }
    ctx = canvas.getContext("2d");
    for(var i=0; i< NUM_PARTICLES; i++) {
        particles.push(new Particle(0,0));
    }
    setInterval(render, 1000/FPS);
	canvas.addEventListener("click", function(){
		x = event.clientX;
		y  = event.clientY-document.getElementById("header").offsetHeight;
		NUM_PARTICLES++;
		particles.push(new Particle(x,y));
	});
	
    canvas.addEventListener('contextmenu', function(ev) {
        ev.preventDefault();
        NUM_PARTICLES--;
		particles.pop();
        return false;
    }, false);
};