/*
  Moorbusch

  Copyright by Timo Häfner
*/

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
