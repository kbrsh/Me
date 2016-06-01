var DAMPING = 0.999;
var clicked = false
document.addEventListener("click", function() {
  clicked = true;
})
function Particle(x, y) {
  this.x = this.oldX = x;
  this.y = this.oldY = y;
}

Particle.prototype.integrate = function() {
  var velocityX = (this.x - this.oldX) * DAMPING;
  var velocityY = (this.y - this.oldY) * DAMPING;
  this.oldX = this.x;
  this.oldY = this.y;
  this.x += velocityX;
  this.y += velocityY;
};

Particle.prototype.attract = function(x, y) {
  var dx = x - this.x;
  var dy = y - this.y;
  var distance = Math.sqrt(dx * dx + dy * dy);
  this.x += dx / distance;
  this.y += dy / distance;
};

Particle.prototype.draw = function() {
  ctx.strokeStyle = '#' + Math.random().toString(16).slice(2, 8);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(this.oldX, this.oldY);
  ctx.lineTo(this.x, this.y);
  ctx.stroke();
};

var canvas = document.getElementById('canv');
var ctx = canvas.getContext('2d');
var particles = [];
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;
var mouse = {
  x: width * 0.5,
  y: height * 0.5
};

function gen() {
  for (var i = 0; i < 500; i++) {
    particles[i] = new Particle(Math.random() * width, Math.random() * height);
  }
}
canvas.addEventListener('mousemove', onMousemove);

function onMousemove(e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

gen();

requestAnimationFrame(frame);

function frame() {
  requestAnimationFrame(frame);
  ctx.clearRect(0, 0, width, height);
  for (var i = 0; i < particles.length; i++) {
    if (clicked) {
      particles[i].attract(mouse.x, mouse.y);
    }
    particles[i].integrate();
    particles[i].draw();
  }
}
