// Animate
var isVisible = function(el) {
  var rect = el.getBoundingClientRect();
  return (rect.bottom >= 300 && rect.top <= (window.innerHeight - 300));
}

var about = document.getElementById("about");
var projects = document.getElementById("projects");
var social = document.getElementById("social");

var aboutDone = false;
var projectsDone = false;
var socialDone = false;

var animateOnScroll = function() {
  if(aboutDone === false && isVisible(about) === true) {
    about.classList.add("fadeIn");
  }

  if(projectsDone === false && isVisible(projects) === true) {
    projects.classList.add("fadeIn");
  }

  if(socialDone === false && isVisible(social) === true) {
    social.classList.add("fadeIn");
  }

  if(aboutDone === true && projectsDone === true && socialDone === true) {
    window.removeEventListener("scroll", animateOnScroll);
  }
}

window.addEventListener("scroll", animateOnScroll);
animateOnScroll();
