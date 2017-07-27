// Navigation
var burger = document.getElementsByClassName('burger')[0];
var overlay = document.getElementsByClassName('overlay')[0];

var toggleMenu = function() {
  burger.classList.toggle('active');
  overlay.classList.toggle('open');
}

burger.addEventListener("click", toggleMenu);

var menuLinks = document.getElementsByClassName("menuLink");
for(var i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener("click", toggleMenu);
}

// Smooth scrolling
var scrollLinks = document.getElementsByClassName("scroll");
