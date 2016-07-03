/*
  Moorbusch

  Copyright by Timo Häfner
*/

// GENERATE OBJS

// targets
// for(var i = 0; i < targets; i++) {
//   tsarr[i] = new Target(
//     getRandom(maxRadius,canvas.width-maxRadius),
//     getRandom(maxRadius+fontSize+padding*3,canvas.height-maxRadius),
//     getRandom(minRadius,maxRadius),
//     buschipic,0
//   );
// }

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

// play-button
var bStart = new Button(
  padding,
  canvas.height/2-fontSize/2+padding,
  canvas.width+padding,
  50,
  'Play',
  function() {
    state = 1;
    score = 0;
    startTime = Date.now();
    // timer = time;
    // timerID = window.setInterval(function() {
    //   timer--;
    // },1000);
});

// START
// render();
