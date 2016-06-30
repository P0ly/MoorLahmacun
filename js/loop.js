/*
  Moorbusch

  Copyright by Timo Häfner
*/

// LOOP

// UPDATE
var updateID = window.setInterval(function() {

  // lag calculation
  lagStart = Date.now();

  states.update[state]();

  // update input
  if(mouse) {
    clicked = false;
  }

  if(!mouse) {
    clicked = true;
  }

  // lag calculation
  lag = Date.now() - lagStart;

},1000/ups);


// RENDER
(function render() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // UI
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

  states.render[state]();

  if(devmode) {

    // dev text
    ctx.fillStyle = 'red';
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

  window.requestAnimationFrame(render);

})();

// TODO restart?
