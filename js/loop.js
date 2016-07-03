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
