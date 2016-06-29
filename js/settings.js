/*
  Moorbusch

  Copyright by Timo Häfner
*/

// SETTINGS

// game mechanic
var ups = 30;
var devmode = true;
var buschimode = false;
var time = 20;
var targets = 5;
var bushes = 50;
var bushSpawn = 2000;
var bushMaxHeight = 100;
var maxRadius = 30;
var minRadius = 20;

// ui
var font = 'monospace';
var fontSize = 20;
var fontColor = '#33CC33';
var color = 'white';
var colorHover = '#ccffcc';
var padding = 5;


// GLOBAL VAR

var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var mouse = false, mouseX = 0, mouseY = 0, clicked = false;
var score = 0, timer = 0;
var state = 0, fps = 0, frame = 0;
var timerID = 0; // intervalls
var fpsCounter = window.setInterval(function() {
  fps = frame;
  frame = 0;
},1000);
var buschipic = new Image();
buschipic.src = 'img/buschi.png';
var tsarr = [];
var bsarr = [];
var stateTypes = ['game','menu'];
var lag = 0, lagStart = 0;


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

function addInput(x,y,text,type,canvas,func) {
  // TODO insert input-tag
}
