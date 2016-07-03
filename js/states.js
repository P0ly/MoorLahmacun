/*
  Moorbusch

  Copyright by Timo Häfner
*/

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

  },

  update: [

    // MENU
    function() {

      bStart.update();

      // update target
      tsarr[flyTargets].shareUpdate();

    },

    // GAME
    function() {

      // update targets
      for(var i = 0; i < tsarr.length; i++) {
        tsarr[i].shareUpdate();
      }

      // get -1 point if user fails to hit target
      if(mouse || touch) {
        if(inGameView() && clicked && hits <= 0) {
          score--;
        }
      }
      hits = 0;

      // stop
      timer = time - (Date.now() - startTime);
      if(timer <= 0) {

        timer = 0;
        window.clearInterval(timerID);
        state = 0;
        clicked = false; // fix -1 point on start bug

        // reset targets
        for(var i = 0; i < tsarr.length; i++) {
          tsarr[i].place();
          tsarr[i].alive = true;
        }

      }

    }

  ],

  shareRenderBefore: function() {

    if(buschimode) {
      ctx.drawImage(buschipic,0,uiSize,canvas.width,canvas.height);
    }

    // UI
    ctx.fillStyle = color;
    ctx.fillRect(0,0,canvas.width,uiSize);
    ctx.strokeStyle = fontColor;
    ctx.fillStyle = fontColor;
    ctx.font = fontSize + 'px ' + font;
    ctx.strokeText('Moorbusch',padding,fontSize+padding);
    ctx.fillText(
      '| Timer: ' + timer + 'ms  ' + 'Score: ' + score,
      fontSize*6,fontSize+padding
    );

  },

  shareRenderAfter: function() {

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

    }

  },

  render: [

    // MENU
    function() {

      // render target
      tsarr[flyTargets].draw();

      // render bushes
      for(var i = 0; i < bsarr.length; i++) {
        bsarr[i].draw();
      }

      // render ui
      // ctx.fillStyle = color;
      // ctx.fillRect(0,canvas.height/2-fontSize*1.3,canvas.width,fontSize*1.3+padding*3);
      // ctx.fillStyle = fontColor;
      // ctx.font = fontSize*1.3 + 'px ' + font;
      // ctx.fillText(
      //   'Press "Play" to play!',
      //   padding,
      //   canvas.height/2+padding
      // );

      bStart.draw();

    },

    // GAME
    function() {

      // targets
      for(var i = 0; i < tsarr.length; i++) {
        tsarr[i].draw();
      }

      // bushes
      for(var i = 0; i < bsarr.length; i++) {
        bsarr[i].draw();
      }

    }

  ]

};
