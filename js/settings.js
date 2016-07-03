/*
  Moorbusch

  Copyright by Timo Häfner
*/

// SETTINGS

// game mechanic
var ups = 30;
var devmode = true;
var buschimode = true;
var time = 20000;
var targets = 5;
var flyTargets = 3;
var hideTargets = 3;
var targetSpeed = 4;
var bushes = 46;
var bushSpawn = 2000;
var bushMaxHeight = 100;
var maxRadius = 30;
var minRadius = 25;
var playerRadius = 15;

// ui
var font = 'monospace';
var fontSize = 20;
var fontColor = '#33CC33';
var color = 'white';
var colorHover = '#ccffcc';
var padding = 5;
var uiSize = fontSize+padding*3;


// GLOBAL VAR
var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var mouse = false, mouseX = 0, mouseY = 0, clicked = false;
var touch = false, touches = [];
var mousemode = true, touchmode = false;
var score = 0, finalScore = 0, timer = 0;
var state = 0, fps = 0, frame = 0;
var timerID = 0;
var startTime = 0;
var fpsCounter = window.setInterval(function() {
  fps = frame;
  frame = 0;
},1000);
var buschipic = new Image();
buschipic.src = 'img/buschi.png';
var tsarr = [];
var bsarr = [];
var lag = 0, lagStart = 0;
var hits = 0;


// resize canvas
if(document.body.clientWidth < canvas.width) {
  canvas.width = document.body.clientWidth;
}

// GLOBAL FUNC

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getDistance(x1,y1,x2,y2) {
  return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

function isAABBC(x1,y1,w1,h1,x2,y2,w2,h2) {
  if(
    x1 < x2+w2 && x1+w1 > x2 &&
    y1 < y2+h2 && y1+h1 > y2
  ) {
    return true;
  }
  return false;
}

function inGameView() {
  if(mouseY > fontSize+padding*3) return true;
  return false;
}


// LISTENERS

// keys
// document.addEventListener('keydown', checkKeyDown, false);
// document.addEventListener('keyup', checkKeyUp, false);

// mouse
canvas.addEventListener('mousedown', function() {
  mousemode = true;
  touchmode = false;
  mouse = true;
}, false);
canvas.addEventListener('mouseup', function() { mouse = false; }, false);
canvas.addEventListener('mousemove', function(e) {
  mouseX = e.pageX-canvas.offsetLeft;
  mouseY = e.pageY-canvas.offsetTop;
}, false);

// touch
// functions of https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
function touchesIndexById(idToFind) {
  for (var i = 0; i < touches.length; i++) {
    var id = touches[i].identifier;
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

function copyTouch(touch) {
  return {
    identifier: touch.identifier,
    pageX: touch.pageX-canvas.offsetLeft,
    pageY: touch.pageY-canvas.offsetTop
  };
}
// end functions of MDN

canvas.addEventListener("touchstart",function(e) {
  touchmode = true;
  mousemode = false;
  touch = true;
  for(var i = 0; i < e.changedTouches.length; i++) {
    touches.push({
      identifier: e.changedTouches[i].identifier,
      pageX: e.changedTouches[i].pageX-canvas.offsetLeft,
      pageY: e.changedTouches[i].pageY-canvas.offsetTop
    });
  }
}, false);

canvas.addEventListener("touchend", function(e) {
  touch = false;
  var id = -1;
  for(var i = 0; i < e.changedTouches.length; i++) {
    id = touchesIndexById(e.changedTouches[i].identifier);
    if(id >= 0) {
      touches.splice(id,1)
    }
  }
}, false);

// canvas.addEventListener("touchmove", function(e) { e.preventDefault() }, false);

// el.addEventListener("touchcancel", handleCancel, false);
// canvas.addEventListener("touchmove", function(e) {
//
// }, false);

// function checkKeyDown(e) {
//     var keyID = e.keyCode || e.which;
//     if (keyID === 32) { // Space
//         // input.space = true;
//         e.preventDefault();
//     }
// }
//
// function checkKeyUp(e) {
//     var keyID = e.keyCode || e.which;
//     if (keyID === 32) { // Space
//         // input.space = false;
//         e.preventDefault();
//     }
// }
