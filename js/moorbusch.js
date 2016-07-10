/*
  Moorbusch

  Copyright by Timo Häfner
*/

// SETTINGS

// game mechanic
var ups = 30;
var devmode = false;
var buschimode = true;
var time = 20000;
var targets = 5;
var flyTargets = 3;
var hideTargets = 3;
var targetSpeed = 4;
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
var displayScore = document.getElementById('score');
var displayTimer = document.getElementById('timer');
var mouse = false, mouseX = 0, mouseY = 0, clicked = false;
var touch = false, touches = [];
var mousemode = true, touchmode = false;
var score = 0, finalScore = 0, highscore = 0, timer = 20;
var state = 0, fps = 0, frame = 0;
var timerID = 0;
var startTime = 0;
var fpsCounter = window.setInterval(function() {
  fps = frame;
  frame = 0;
},1000);
var buschipic = new Image();
buschipic.src = 'img/buschi-60x60.png';
var tsarr = [];
var bsarr = [];
var lag = 0, lagStart = 0;
var hits = 0;

// RESIZE

// canvas
if(document.body.clientWidth < canvas.width) {
  canvas.width = document.body.clientWidth;
}
if(canvas.height + canvas.offsetTop > window.innerHeight) {
  canvas.height = window.innerHeight - canvas.offsetTop - 80;
}

// number of bushes
var bushes = Math.floor((canvas.width/minRadius)*2);

// font
if(canvas.width < 500) {
  fontSize = 5 * canvas.width / 100 ;
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

function reset() {
  clicked = false; // fix -1 point on start bug
  score = 0;
  timer = time/1000;
  // reset targets
  for(var i = 0; i < tsarr.length; i++) {
    tsarr[i].place();
    tsarr[i].alive = true;
  }
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

canvas.addEventListener("touchmove", function(e) { e.preventDefault() }, false);

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


// BUTTON

function start() {
  state = 1;
  startTime = Date.now();
  reset();
  document.getElementById("playbutton").value = "Restart";
}


// TARGET

var Target = function() {
  this.x = 0;
  this.y = 0;
  this.vy = 0;
  this.vx = 0;
  this.img = buschipic;
  this.radius = buschipic.width/2;
  this.speed = targetSpeed;
  this.alive = true;
};

Target.prototype.draw = function() {

  if(buschimode) {
    ctx.drawImage(
      this.img,
      this.x-this.radius,
      this.y-this.radius
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

};

Target.prototype.isHit = function() {

    if(
      mouse && inGameView() && clicked &&
      getDistance(mouseX,mouseY,this.x,this.y) <= this.radius+playerRadius
    ) {
      this.alive = false;
      score++;
      hits++;
      return true;
    }

    for(var i = 0; i < touches.length; i++) {
      if(
        touch && inGameView() && clicked &&
        getDistance(touches[i].pageX,touches[i].pageY,this.x,this.y) <= this.radius+playerRadius
      ) {
        this.alive = false;
        score++;
        hits++;
        return true;
      }
    }

    return false;

};

Target.prototype.shareUpdate = function() {

  if(this.alive) {
    this.update();
  } else {
    this.speed *= 1.1;
    this.vy = this.speed*4;
    if(this.y >= canvas.height) {
      this.vy = 0;
      this.place();
    }
  }

  this.x += this.vx;
  this.y += this.vy;

};


var FlyTarget = function() {};
FlyTarget.prototype = new Target();

FlyTarget.prototype.update = function() {

  if(this.x-this.radius > canvas.width) this.place();

};

FlyTarget.prototype.place = function() {

  this.alive = true;
  this.vy = 0;
  this.speed = targetSpeed;
  this.vx = this.speed;

  this.x = getRandom(-(this.radius), -(canvas.width/2));
  this.y = getRandom(
    this.radius+fontSize+padding*3,
    canvas.height-this.radius-bushMaxHeight
  );

};

var HideTarget = function() {};
HideTarget.prototype = new Target();

HideTarget.prototype.update = function() {

  if(this.y < canvas.height-bushMaxHeight) {
    this.speed *= 1.1;
    this.vy = this.speed;
  }
  if(this.vy > 0 && this.y > canvas.height+this.radius*2) {
    this.place();
  }

};

HideTarget.prototype.place = function() {

  this.alive = true;
  this.speed = targetSpeed;
  this.vy = -(this.speed*0.4);

  this.x = getRandom(this.radius, canvas.width-this.radius);
  this.y = getRandom(
    canvas.height+this.radius,
    canvas.height+this.radius+bushMaxHeight
  );

};


// BUSH

function Bush(x, y, radius, color) {

  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.show = true;
  this.lastSpawn = Date.now();

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

Bush.prototype.update = function() {

  if(Date.now()-this.lastSpawn >= bushSpawn) this.show = true;
  if(
    mousemode && this.show && mouse && clicked &&
    getDistance(mouseX,mouseY,this.x,this.y) <= this.radius+playerRadius
  ) {
    this.show = false;
    hits++;
    this.lastSpawn = Date.now();
  }

  for(var i = 0; i < touches.length; i++) {
    if(
      touch && inGameView() && clicked &&
      getDistance(touches[i].pageX,touches[i].pageY,this.x,this.y) <= this.radius+playerRadius
    ) {
      this.show = false;
      hits++;
      this.lastSpawn = Date.now();
    }
  }

};


// STATES
// 0 = MENU
// 1 = GAME

var states = {

  shareUpdate: function() {

    // update input
    if(mouse && mousemode) clicked = false;
    if(!mouse && mousemode) clicked = true;
    if(touch && touchmode) clicked = false;
    if(!touch && touchmode) clicked = true;

    // update infos
    displayTimer.innerHTML = timer;
    displayScore.innerHTML = score;

  },

  update: [

    // MENU
    function() {

      // update target
      tsarr[flyTargets].shareUpdate();

      // bushes
      for(var i = 0; i < bsarr.length; i++) {
        bsarr[i].update();
      }

      score = finalScore;

    },

    // GAME
    function() {

      // targets
      for(var i = 0; i < tsarr.length; i++) {
        if(tsarr[i].alive) tsarr[i].isHit();
        tsarr[i].shareUpdate();
      }

      // bushes
      for(var i = 0; i < bsarr.length; i++) {
        bsarr[i].update();
      }

      // get -1 point if user fails to hit target
      if(mouse || touch) {
        if(inGameView() && clicked && hits <= 0) {
          score--;
        }
      }
      hits = 0;

      // stop
      timer = Math.floor((time - (Date.now() - startTime))/1000);
      if(timer <= 0) {

        finalScore = score;
        if(finalScore > highscore) highscore = finalScore;
        state = 0;
        reset();

        // reset play-button
        document.getElementById("playbutton").value = "Play";

      }

    }

  ],

  shareRenderBefore: function() {

    // if(buschimode) {
    //   ctx.drawImage(
    //     buschipic,
    //     canvas.width/4,
    //     canvas.height/4,
    //     canvas.width/2,
    //     canvas.height/2
    //   );
    // }

    // UI
    // ctx.fillStyle = color;
    // ctx.fillRect(0,0,canvas.width,uiSize);
    // ctx.strokeStyle = fontColor;
    // ctx.fillStyle = fontColor;
    // ctx.font = fontSize + 'px ' + font;
    // ctx.strokeText('Moorbusch',padding,fontSize+padding);
    // ctx.fillText(
    //   '| Timer: ' + timer + 's  ' + 'Score: ' + score,
    //   fontSize*6,fontSize+padding
    // );

  },

  shareRenderAfter: function() {

    // render bushes
    for(var i = 0; i < bsarr.length; i++) {
      if(bsarr[i].show) bsarr[i].draw();
    }

    if(devmode) {

      // dev text
      ctx.fillStyle = 'red';
      ctx.font = fontSize*0.8 + 'px ' + font;
      ctx.fillText('FPS: ' + fps,5,uiSize+25);
      ctx.font = fontSize*0.5 + 'px ' + font;
      ctx.fillText('X: ' + mouseX,5,uiSize+fontSize*0.8+25);
      ctx.fillText('Y: ' + mouseY,5,uiSize+fontSize*0.8+35);
      ctx.fillText('Mouse: ' + mouse,5,uiSize+fontSize*0.8+45);
      ctx.fillText('Clicked: ' + clicked,5,uiSize+fontSize*0.8+55);
      ctx.fillText('Lag: ' + lag + ' ms',5,uiSize+fontSize*0.8+65);
      ctx.fillText('Touch: ' + touch,5,uiSize+fontSize*0.8+75);
      ctx.fillText('Mousemode: ' + mousemode,5,uiSize+fontSize*0.8+85);
      ctx.fillText('Touchmode: ' + touchmode,5,uiSize+fontSize*0.8+95);
      for(var i = 0; i < touches.length; i++) {

        ctx.fillText(
          'Touches[' + i + ']: { ID:' + touches[i].identifier +
          ', X:' + touches[i].pageX + ', Y:' + touches[i].pageY + ' }',
          5,
          uiSize+fontSize*0.8+105+i*10
        );
        // input
        ctx.fillStyle = 'rgba(255,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(touches[i].pageX,touches[i].pageY,playerRadius,0,Math.PI*2,true);
        ctx.fill();
      }

      // input
      if(mouseY != 0 && mouseX != 0) {
        ctx.fillStyle = 'rgba(255,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(mouseX,mouseY,playerRadius,0,Math.PI*2,true);
        ctx.fill();
      }

      // target line
      tsarr.forEach(function(e,i,arr) {
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(mouseX,mouseY);
        ctx.lineTo(e.x, e.y);
        ctx.stroke();
      });

    }

  },

  render: [

    // MENU
    function() {

      // render target
      tsarr[flyTargets].draw();

      // render ui
      ctx.fillStyle = color;
      ctx.fillRect(0,canvas.height/2-fontSize*1.3,canvas.width,fontSize*1.3+padding*3);
      ctx.fillStyle = fontColor;
      ctx.font = fontSize*1.3 + 'px ' + font;
      ctx.fillText(
        'Your Highscore: ' + highscore,
        padding,
        canvas.height/2+padding
      );

    },

    // GAME
    function() {

      // targets
      for(var i = 0; i < tsarr.length; i++) {
        tsarr[i].draw();
      }

    }

  ]

};


// GENERATE OBJS

for(var i = 0; i < flyTargets; i++) {
  tsarr[i] = new FlyTarget();
  tsarr[i].place();
}

for(var i = flyTargets; i < hideTargets+flyTargets; i++) {
  tsarr[i] = new HideTarget();
  tsarr[i].place();
}

// bushes
for(var i = 0,w = 0, r = 1; i < bushes; i++,w++) {
  if(i == Math.floor(bushes/2)) {
    w = 0;
    r++;
  }
  bsarr[i] = new Bush(
    w*maxRadius,
    canvas.height-minRadius*r,
    getRandom(minRadius*1.2,maxRadius),
    'rgb('+
      getRandom(50,100)+','+
      getRandom(225,255)+','+
      getRandom(50,100)+
    ')'
  );
}


// LOOPS

// UPDATE
var updateID = window.setInterval(function() {

  // lag calculation
  lagStart = Date.now();

  states.update[state]();
  states.shareUpdate();

  // lag calculation
  lag = Date.now() - lagStart;

},1000/ups);


// RENDER
(function render() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  states.shareRenderBefore();
  states.render[state]();
  states.shareRenderAfter();

  frame++;

  window.requestAnimationFrame(render);

})();
