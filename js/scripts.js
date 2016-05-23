/* Util */
function hasClass(el, cls) {
  return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
}


/* Nav */
$('.button_container').click(function() {
   $('.button_container').toggleClass('active');
   $('.overlay').toggleClass('open');
 });

 $(".menuLink").click(function() {
   $('.button_container').toggleClass('active');
   $('.overlay').toggleClass('open');
 });





/* Window Leave Title Thing */

function userLeft() {
  document.title = "I Miss You! | Kabir Shah";
}

function userBack() {
  document.title = "Kabir Shah";
}

  var hidden = "hidden";

  // Standards:
  if (hidden in document)
    document.addEventListener("visibilitychange", onchange);
  else if ((hidden = "mozHidden") in document)
    document.addEventListener("mozvisibilitychange", onchange);
  else if ((hidden = "webkitHidden") in document)
    document.addEventListener("webkitvisibilitychange", onchange);
  else if ((hidden = "msHidden") in document)
    document.addEventListener("msvisibilitychange", onchange);
  // IE 9 and lower:
  else if ("onfocusin" in document)
    document.onfocusin = document.onfocusout = onchange;
  // All others:
  else
    window.onpageshow = window.onpagehide
    = window.onfocus = window.onblur = onchange;

  function onchange (evt) {
    var v = "visible", h = "hidden",
        evtMap = {
          focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
        };

    evt = evt || window.event;
    if (evt.type in evtMap)
      document.body.className = evtMap[evt.type];
    else
      document.body.className = this[hidden] ? "hidden" : "visible";
  }

  // set the initial state (but only if browser supports the Page Visibility API)
  if( document[hidden] !== undefined )
    onchange({type: document[hidden] ? "blur" : "focus"});

function check() {
  if(hasClass(document.body, "hidden")) {
    userLeft();
  } else if(hasClass(document.body, "visible")) {
    userBack();
  }
}

setInterval(check, 500)


/* Random Highlight */
var pick=~~(Math.random()*359),
    tag=document.createElement('style'),
    style='::-moz-selection {color:white;text-shadow:rgba(0,0,0,.1)1px 2px 2px;background-color:hsl($pick,75%,50%)!important}::-webkit-selection{color:white;text-shadow:rgba(0,0,0,.1)1px 2px 2px;background-color:hsl($pick,75%,50%)!important}::selection{color:white;text-shadow:rgba(0,0,0,.1)1px 2px 2px;background-color:hsl($pick,75%,50%)!important}';
  tag.innerHTML=style.replace(/\$pick/g,pick);
  document.body.appendChild(tag);

/* Easter Eggs */

  var pressedK = [];
  var konamiCode = '38,38,40,40,37,39,37,39,66,65';
  // Listen for key presses and record their codes in the "pressed" array.
  window.addEventListener('keydown', function(k) {
    pressedK.push(k.keyCode);
    // If the user enters the "KonamiCode" sequence...
    if (pressedK.toString().indexOf(konamiCode) >= 0) {
      surpriseK();
      pressedK = [];
    }
  }, true);
var surpriseK = function() {
  alert('Try Editing the Text ;)')
  document.getElementsByTagName("HTML")[0].setAttribute("contenteditable", "true");
};

var pressedM = [];
var musicCode = '77,85,83,73,67';
// Listen for key presses and record their codes in the "pressed" array.
window.addEventListener('keydown', function(k) {
  pressedM.push(k.keyCode);
  // If the user enters the "KonamiCode" sequence...
  if (pressedM.toString().indexOf(musicCode) >= 0) {
    surpriseM();
    pressedM = [];
  }
}, true);
var surpriseM = function() {
  alert('Coming Soon');
};
