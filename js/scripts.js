/* loader */
document.body.style.overflowY = "hidden"
document.getElementById("loader").style.opacity = "0";
document.body.style.overflowY = "auto"
setTimeout(function() {
  document.getElementById("loader").style.display = "none";
}, 750);



/* Nav */
document.querySelector('.burger').addEventListener("click", function() {
   document.querySelector('.burger').classList.toggle('active');
   document.querySelector('.overlay').classList.toggle('open');
 });

 var menuLinks = document.querySelectorAll(".menuLink");

 for(var i = 0; i < menuLinks.length; i++) {
   menuLinks[i].addEventListener("click", function() {
     document.querySelector('.burger').classList.toggle('active');
     document.querySelector('.overlay').classList.toggle('open');
   });
 }


/* smooth scroll */
  (function() {

       'use strict';

      // Feature Test
      if ( 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach ) {

          // Function to animate the scroll
          var smoothScroll = function (anchor, duration) {

              // Calculate how far and how fast to scroll
              var startLocation = window.pageYOffset;
              var endLocation = anchor.offsetTop;
              var distance = endLocation - startLocation;
              var increments = distance/(duration/16);
              var stopAnimation;

              // Scroll the page by an increment, and check if it's time to stop
              var animateScroll = function () {
                  window.scrollBy(0, increments);
                  stopAnimation();
              };

              // If scrolling down
              if ( increments >= 0 ) {
                  // Stop animation when you reach the anchor OR the bottom of the page
                  stopAnimation = function () {
                      var travelled = window.pageYOffset;
                      if ( (travelled >= (endLocation - increments)) || ((window.innerHeight + travelled) >= document.body.offsetHeight) ) {
                          clearInterval(runAnimation);
                      }
                  };
              }
              // If scrolling up
              else {
                  // Stop animation when you reach the anchor OR the top of the page
                  stopAnimation = function () {
                      var travelled = window.pageYOffset;
                      if ( travelled <= (endLocation || 0) ) {
                          clearInterval(runAnimation);
                      }
                  };
              }

              // Loop the animation function
              var runAnimation = setInterval(animateScroll, 16);

          };

          // Define smooth scroll links
          var scrollToggle = document.querySelectorAll('.scroll');

          // For each smooth scroll link
          [].forEach.call(scrollToggle, function (toggle) {

              // When the smooth scroll link is clicked
              toggle.addEventListener('click', function(e) {

                  // Prevent the default link behavior
                  e.preventDefault();

                  // Get anchor link and calculate distance from the top
                  var dataID = toggle.getAttribute('href');
                  var dataTarget = document.querySelector(dataID);
                  var dataSpeed = toggle.getAttribute('data-speed');

                  // If the anchor exists
                  if (dataTarget) {
                      // Scroll to the anchor
                      smoothScroll(dataTarget, dataSpeed || 500);
                  }

              }, false);

          });

      }

   })();
