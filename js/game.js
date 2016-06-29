/*
  Moorbusch

  Copyright by Timo Häfner
*/

// GENERATE OBJS

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
    r = (minRadius*r > bushMaxHeight) ? 0 : r+1;
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

//var t = new Target(100,100,25,buschipic);
var bStart = new Button(canvas.width-fontSize*'Play'.length,fontSize,'Play',function() {

  state = 1;

  score = 0;
  timer = time;
  timerID = window.setInterval(function() {
    timer--;
  },1000);

});


// LISTENERS

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


// START
// render();
