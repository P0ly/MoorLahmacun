/*
  Moorbusch

  Copyright by Timo Häfner
*/

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
var targets = 5;
var bushes = 50;
var bushSpawn = 2000;
var maxRadius = 30;
var minRadius = 20;

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
var lag = 0, lagStart = 0;


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

function addInput(x,y,text,type,canvas,func) {
  // TODO insert input-tag
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

    if(
      mouse && inGameView() && clicked &&
      getDistance(mouseX,mouseY,this.x,this.y) <= this.radius
    ) {
      score++;
      this.placeRandom();
    }

};

Target.prototype.placeRandom = function() {
  this.radius = getRandom(maxRadius,40);
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
  if(this.show) {
    ctx.fillStyle = 'darkgreen';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
    ctx.fill();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius*0.9,0,Math.PI*2,true);
    ctx.fill();
  }
};

// Bush.prototype.update = function(id) {
//   if(getDistance(mouseX,mouseY,this.x,this.y) <= this.radius && mouse && clicked) {
//     this.show = false;
//     score++;
//     window.setTimeout(bsarr[i].show = true, bushSpawn);
//   }
// };

// ########  ##     ## ######## ########  #######  ##    ##
// ##     ## ##     ##    ##       ##    ##     ## ###   ##
// ##     ## ##     ##    ##       ##    ##     ## ####  ##
// ########  ##     ##    ##       ##    ##     ## ## ## ##
// ##     ## ##     ##    ##       ##    ##     ## ##  ####
// ##     ## ##     ##    ##       ##    ##     ## ##   ###
// ########   #######     ##       ##     #######  ##    ##

function Button(x,y,text,func) {
  this.text = text;
  this.func = func;
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
    this.func();
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

    // render bushes
    for(var i = 0; i < bsarr.length; i++) {
      bsarr[i].draw();
    }

    // render ui
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

    // render targets
    for(var i = 0; i < tsarr.length; i++) {
      tsarr[i].draw();
    }

    // render bushes
    for(var i = 0; i < bsarr.length; i++) {
      bsarr[i].draw();
    }

    // t.draw();
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

    bStart.update();

  },
  // game
  function() {

    // update targets
    for(var i = 0; i < tsarr.length; i++) {
      tsarr[i].update();
    }

    // get -1 point if user fails to hit target
    if(
      mouse && inGameView() && clicked &&
      getDistance(mouseX,mouseY,this.x,this.y) > this.radius
    ) {
      score--;
    }

    // for(var i = 0; i < bsarr.length; i++) {
    //   bsarr[i].update(i);
    // }
    // t.update();

    // stop
    if(timer <= 0) {

      window.clearInterval(timerID);
      // window.clearTimeout(loopID);
      state = 0;
      clicked = false; // fix -1 point on start bug

    }

  }
];

function updateInput() {

  if(mouse) {
    clicked = false;
  }

  if(!mouse) {
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

  // lag calculation
  lagStart = Date.now();

  update[state]();
  updateInput();

  // lag calculation
  lag = Date.now() - lagStart;

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
    ctx.fillText('Lag: ' + lag + ' ms',5,fontSize+padding*3+fontSize*0.8+65);

  }

  frame++;
  // loopID = window.setTimeout(loop,1000/ups);
  window.requestAnimationFrame(loop);

}

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

// document.addEventListener('keydown', checkKeyDown, false);
// document.addEventListener('keyup', checkKeyUp, false);
canvas.addEventListener('mousedown', function() { mouse = true; }, false);
canvas.addEventListener('mouseup', function() { mouse = false; }, false);
canvas.addEventListener('mousemove', updateMouseCoordinates, false);

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

function updateMouseCoordinates(e) {
    mouseX = e.pageX-canvas.offsetLeft;
    mouseY = e.pageY-canvas.offsetTop;
}


//  ######   ######## ##    ##     #######  ########        ##  ######
// ##    ##  ##       ###   ##    ##     ## ##     ##       ## ##    ##
// ##        ##       ####  ##    ##     ## ##     ##       ## ##
// ##   #### ######   ## ## ##    ##     ## ########        ##  ######
// ##    ##  ##       ##  ####    ##     ## ##     ## ##    ##       ##
// ##    ##  ##       ##   ###    ##     ## ##     ## ##    ## ##    ##
//  ######   ######## ##    ##     #######  ########   ######   ######

// targets
for(var i = 0; i < targets; i++) {
  tsarr[i] = new Target(
    getRandom(maxRadius,canvas.width-maxRadius),
    getRandom(maxRadius+fontSize+padding*3,canvas.height-maxRadius),
    getRandom(minRadius,maxRadius),
    buschipic,0
  );
}

// bushes
for(var i = 0,w = 0, r = 1; i < bushes; i++,w++) {
  if(i*maxRadius % canvas.width == 100) {
    w = 0;
    r++;
  }
  bsarr[i] = new Bush(
    w*maxRadius,
    canvas.height-minRadius*r,
    getRandom(minRadius*1.2,maxRadius),
    'green'
  );
}

//var t = new Target(100,100,25,buschipic);
var bStart = new Button(canvas.width-fontSize*'Play'.length,fontSize,'Play',function() {

  state = 1;

  score = 0;
  timer = time;
  timerID = window.setInterval(function() {
    timer--;
  },1000);

});

loop(); // start
