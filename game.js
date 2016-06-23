/*
  Moorbusch

  Copyright by Timo Häfner
*/
"use strict";

//  ######  ######## ######## ######## #### ##    ##  ######    ######
// ##    ## ##          ##       ##     ##  ###   ## ##    ##  ##    ##
// ##       ##          ##       ##     ##  ####  ## ##        ##
//  ######  ######      ##       ##     ##  ## ## ## ##   ####  ######
//       ## ##          ##       ##     ##  ##  #### ##    ##        ##
// ##    ## ##          ##       ##     ##  ##   ### ##    ##  ##    ##
//  ######  ########    ##       ##    #### ##    ##  ######    ######

// game mechanic
var ups = 30;
var devmode = true;
var buschimode = false;
var time = 20;
var targets = 0;
var bushes = 10;

// ui
var font = 'monospace';
var fontSize = 20;
var fontColor = '#33CC33';
var color = 'white';
var colorHover = '#ccffcc';
var padding = 5;


//  ######   ##        #######  ########     ###    ##          ##     ##    ###    ########
// ##    ##  ##       ##     ## ##     ##   ## ##   ##          ##     ##   ## ##   ##     ##
// ##        ##       ##     ## ##     ##  ##   ##  ##          ##     ##  ##   ##  ##     ##
// ##   #### ##       ##     ## ########  ##     ## ##          ##     ## ##     ## ########
// ##    ##  ##       ##     ## ##     ## ######### ##           ##   ##  ######### ##   ##
// ##    ##  ##       ##     ## ##     ## ##     ## ##            ## ##   ##     ## ##    ##
//  ######   ########  #######  ########  ##     ## ########       ###    ##     ## ##     ##

var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');
var mouse = false, mouseX = 0, mouseY = 0, clicked = false;
var score = 0, timer = 0;
var state = 0, fps = 0, frame = 0;
var timerID = 0, loopID = 0, updateID = 0; // intervalls
var fpsCounter = window.setInterval(function() {
  fps = frame;
  frame = 0;
},1000);
var buschipic = new Image();
buschipic.src = 'img/buschi.png';
var tsarr = [];
var bsarr = [];
var stateTypes = ['game','menu'];

// generated objects //
for(var i = 0; i < targets; i++) {
  tsarr[i] = new Target(100,100+50*i,getRandom(20,30),buschipic,0);
}
var t = new Target(100,100,25,buschipic);
var bStart = new Button(canvas.width-fontSize*'Play'.length,fontSize,'Play','play');

function play() {
  state = 1;

  score = 0;
  timer = time;
  timerID = window.setInterval(function() {
    timer--;
  },1000);
}


//   ######   ##        #######  ########     ###    ##          ######## ##     ## ##    ##  ######
//  ##    ##  ##       ##     ## ##     ##   ## ##   ##          ##       ##     ## ###   ## ##    ##
//  ##        ##       ##     ## ##     ##  ##   ##  ##          ##       ##     ## ####  ## ##
//  ##   #### ##       ##     ## ########  ##     ## ##          ######   ##     ## ## ## ## ##
//  ##    ##  ##       ##     ## ##     ## ######### ##          ##       ##     ## ##  #### ##
//  ##    ##  ##       ##     ## ##     ## ##     ## ##          ##       ##     ## ##   ### ##    ##
//   ######   ########  #######  ########  ##     ## ########    ##        #######  ##    ##  ######

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

// ########    ###    ########   ######   ######## ########
//    ##      ## ##   ##     ## ##    ##  ##          ##
//    ##     ##   ##  ##     ## ##        ##          ##
//    ##    ##     ## ########  ##   #### ######      ##
//    ##    ######### ##   ##   ##    ##  ##          ##
//    ##    ##     ## ##    ##  ##    ##  ##          ##
//    ##    ##     ## ##     ##  ######   ########    ##

function Target(x, y, radius, img, type) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.img = img;
  this.type = type;
}

Target.prototype.draw = function() {

  if(buschimode) {
    ctx.drawImage(
      this.img,
      this.x-this.radius,
      this.y-this.radius,
      this.radius*2,
      this.radius*2
    );
  } else {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius/2,0,Math.PI*2,true);
    ctx.fill();
  }

  if(devmode) {
    // target line
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(mouseX,mouseY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
  }

};

Target.prototype.update = function() {

  if(mouse && inGameView()) {

    if(clicked && getDistance(mouseX,mouseY,t.x,t.y) < this.radius) {
      score++;
      t.placeRandom();
    } else if(clicked && getDistance(mouseX,mouseY,t.x,t.y) > this.radius) {
      score--;
    }

  }

};

Target.prototype.placeRandom = function() {
  this.radius = getRandom(30,40);
  this.x = getRandom(canvas.width-this.radius,this.radius);
  this.y = getRandom(canvas.height-this.radius,this.radius+fontSize+padding*3);
};



// ########  ##     ##  ######  ##     ##
// ##     ## ##     ## ##    ## ##     ##
// ##     ## ##     ## ##       ##     ##
// ########  ##     ##  ######  #########
// ##     ## ##     ##       ## ##     ##
// ##     ## ##     ## ##    ## ##     ##
// ########   #######   ######  ##     ##

function Bush(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.show = true;
}

Bush.prototype.draw = function() {
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
  ctx.fill();
  ctx.fillStyle = 'green';
  ctx.beginPath();
  ctx.arc(this.x,this.y,this.radius/2,0,Math.PI*2,true);
  ctx.fill();
};


// ########  ##     ## ######## ########  #######  ##    ##
// ##     ## ##     ##    ##       ##    ##     ## ###   ##
// ##     ## ##     ##    ##       ##    ##     ## ####  ##
// ########  ##     ##    ##       ##    ##     ## ## ## ##
// ##     ## ##     ##    ##       ##    ##     ## ##  ####
// ##     ## ##     ##    ##       ##    ##     ## ##   ###
// ########   #######     ##       ##     #######  ##    ##

function Button(x,y,text,func) {
  this.text = text;
  this.func = func; // function-name as a string!
  this.x = x;
  this.y = y;
  this.width = (fontSize*this.text.length*0.9);
  this.height = (fontSize+padding*3);
}

Button.prototype.draw = function () {
  if(isAABBC(
      this.x-padding,
      this.y-fontSize,
      this.width,
      this.height,
      mouseX,
      mouseY,
      1,
      1
  )) {
    ctx.fillStyle = colorHover;
  } else {
    ctx.fillStyle = color;
  }
  ctx.fillRect(this.x-padding,this.y-fontSize,this.width,this.height);
  ctx.fillStyle = fontColor;
  ctx.font =  fontSize + 'px ' + font;
  ctx.fillText(this.text,this.x+padding,this.y+padding);
};

Button.prototype.update = function() {
  if(isAABBC(
    this.x-padding,
    this.y-fontSize,
    this.width,
    this.height,
    mouseX,
    mouseY,
    1,
    1
  ) && mouse && clicked) {
    window[this.func]();
  }
};

Button.prototype.reCal = function() {
  this.width = (fontSize*this.text.length*0.9);
  this.height = (fontSize+padding*3);
};


// ########  ######## ##    ## ########  ######## ########
// ##     ## ##       ###   ## ##     ## ##       ##     ##
// ##     ## ##       ####  ## ##     ## ##       ##     ##
// ########  ######   ## ## ## ##     ## ######   ########
// ##   ##   ##       ##  #### ##     ## ##       ##   ##
// ##    ##  ##       ##   ### ##     ## ##       ##    ##
// ##     ## ######## ##    ## ########  ######## ##     ##

function drawUI() {
  ctx.fillStyle = color;
  ctx.fillRect(0,0,canvas.width,fontSize+padding*3);
  ctx.strokeStyle = fontColor;
  ctx.fillStyle = fontColor;
  ctx.font = fontSize + 'px ' + font;
  ctx.strokeText('Moorbusch',padding,fontSize+padding);
  ctx.fillText(
    '| Timer: ' + timer + 's  ' + 'Score: ' + score,
    fontSize*6,fontSize+padding
  );
}

var render = [
  // menu
  function() {

    if(buschimode) {
      ctx.drawImage(buschipic,0,0,canvas.width,canvas.height);
      t.draw();
      t.placeRandom();
    }

    drawUI();

    ctx.fillStyle = color;
    ctx.fillRect(0,canvas.height/2-fontSize*1.3,canvas.width,fontSize*1.3+padding*3);
    ctx.fillStyle = fontColor;
    ctx.font = fontSize*1.3 + 'px ' + font;
    ctx.fillText(
      'Press "Play" to play!',
      padding,
      canvas.height/2+padding
    );

    bStart.draw();

  },
  // game
  function() {

    drawUI();

    for(var i = 0; i < tsarr.length; i++) {
      tsarr[i].draw();
    }
    t.draw();

    // bStart.draw();

  }
];


// ##     ## ########  ########     ###    ######## ########
// ##     ## ##     ## ##     ##   ## ##      ##    ##
// ##     ## ##     ## ##     ##  ##   ##     ##    ##
// ##     ## ########  ##     ## ##     ##    ##    ######
// ##     ## ##        ##     ## #########    ##    ##
// ##     ## ##        ##     ## ##     ##    ##    ##
//  #######  ##        ########  ##     ##    ##    ########

var update = [
  // menu
  function() {
    // start();
    // timerID = window.setInterval(function() {
    //   timer--;
    // },1000);
    // timer = time;
    // score = 0;
    // bStart.text = 'Restart';
    // bStart.func = 'restart';
    // bStart.reCal();

    bStart.update();
  },
  // game
  function() {

    t.update();

    // stop
    if(timer <= 0) {
      // stop();
      window.clearInterval(timerID);
      // window.clearTimeout(loopID);
      state = 0;
      clicked = false; // fix -1 point on start bug
      // bStart.text = 'Play';
      // bStart.func = 'start';
      // bStart.reCal();
    }

  }
];

function updateInput() {
  if(mouse && clicked) {
    clicked = false;
  }
  if(!mouse && !clicked) {
    clicked = true;
  }
}


// ##        #######   #######  ########
// ##       ##     ## ##     ## ##     ##
// ##       ##     ## ##     ## ##     ##
// ##       ##     ## ##     ## ########
// ##       ##     ## ##     ## ##
// ##       ##     ## ##     ## ##
// ########  #######   #######  ##

updateID = window.setInterval(function() {

  update[state]();
  updateInput();

},1000/ups);

function loop() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  render[state]();

  if(devmode) {
    // dev text
    ctx.fillStyle = 'blue';
    ctx.font = fontSize*0.8 + 'px ' + font;
    ctx.fillText('FPS: ' + fps,5,fontSize+padding*3+25);
    ctx.font = fontSize*0.5 + 'px ' + font;
    ctx.fillText('X: ' + mouseX,5,fontSize+padding*3+fontSize*0.8+25);
    ctx.fillText('Y: ' + mouseY,5,fontSize+padding*3+fontSize*0.8+35);
    ctx.fillText('Mouse: ' + mouse,5,fontSize+padding*3+fontSize*0.8+45);
    ctx.fillText('Clicked: ' + clicked,5,fontSize+padding*3+fontSize*0.8+55);
    ctx.fillText('Hit: ' + getDistance(mouseX,mouseY,t.x,t.y),5,fontSize+padding*3+fontSize*0.8+65);
  }

  frame++;
  // loopID = window.setTimeout(loop,1000/ups);
  window.requestAnimationFrame(loop);

}

// start
// function start() {
//
//   timerID = window.setInterval(function() {
//     timer--;
//   },1000);
//   timer = time;
//   score = 0;
//   state = 1;
//   bStart.text = 'Restart';
//   bStart.func = 'restart';
//   bStart.reCal();
//
//   loop();
//
// }

// stop
// function stop() {
//
//   window.clearInterval(timerID);
//   // window.clearTimeout(loopID);
//   state = 0;
//   clicked = false; // fix -1 point on start bug
//   bStart.text = 'Play';
//   bStart.func = 'start';
//   bStart.reCal();
//
//   loop();
//
// }

// function restart() {
//   stop();
//   start();
// }


// ##       ####  ######  ######## ######## ##    ## ######## ########   ######
// ##        ##  ##    ##    ##    ##       ###   ## ##       ##     ## ##    ##
// ##        ##  ##          ##    ##       ####  ## ##       ##     ## ##
// ##        ##   ######     ##    ######   ## ## ## ######   ########   ######
// ##        ##        ##    ##    ##       ##  #### ##       ##   ##         ##
// ##        ##  ##    ##    ##    ##       ##   ### ##       ##    ##  ##    ##
// ######## ####  ######     ##    ######## ##    ## ######## ##     ##  ######

function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 32) { // Space
        // input.space = true;
        e.preventDefault();
    }
}

function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    if (keyID === 32) { // Space
        // input.space = false;
        e.preventDefault();
    }
}

function updateMouseCoordinates(e) {
    mouseX = e.pageX-canvas.offsetLeft;
    mouseY = e.pageY-canvas.offsetTop;
}

// document.addEventListener('keydown', checkKeyDown, false);
// document.addEventListener('keyup', checkKeyUp, false);
canvas.addEventListener('mousedown', function() { mouse = true; }, false);
canvas.addEventListener('mouseup', function() { mouse = false; }, false);
canvas.addEventListener('mousemove', updateMouseCoordinates, false);


loop(); // start
