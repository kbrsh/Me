// Navigation
var navigation = document.getElementsByClassName("navigation")[0];
var burger = document.getElementsByClassName("burger")[0];
var overlay = document.getElementsByClassName("overlay")[0];

var toggleMenu = function(e) {
  if(navigation.getAttribute("class") === "navigation fadeInSlow") {
    navigation.classList.remove("fadeInSlow");
  }
  burger.classList.toggle("active");
  overlay.classList.toggle("open");
}

burger.addEventListener("click", toggleMenu);

var menuLinks = document.getElementsByClassName("menuLink");
for(var i = 0; i < menuLinks.length; i++) {
  menuLinks[i].addEventListener("click", toggleMenu);
}

// Smooth scrolling
var scroll = function(el) {
  return function(e) {
    e.preventDefault();

    var offset = window.scrollY;
    var distance = (el.offsetTop - offset);
    var end = distance + offset;
    var left = distance % 50;

    distance -= left;
    window.scrollBy(0, left);

    var increment = distance / 50;

    var interval = setInterval(function() {
      window.scrollBy(0, increment);
      if(window.scrollY === end) {
        clearInterval(interval);
      }
    }, 10);
  }
}

var scrollLinks = document.getElementsByClassName("scroll");
for(var i = 0; i < scrollLinks.length; i++) {
  var link = scrollLinks[i];
  var el = document.getElementById(link.href.split("#")[1]);
  link.addEventListener("click", scroll(el));
}
