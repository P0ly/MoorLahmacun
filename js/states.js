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
    if(mouse) {
      clicked = false;
    }

    if(!mouse) {
      clicked = true;
    }

  },

  update: [

    // MENU
    function() {

      bStart.update();

      // update target
      tsarr[flyTargets].update();

    },

    // GAME
    function() {

      // update targets
      for(var i = 0; i < tsarr.length; i++) {
        if(tsarr[i].isHit()) {
          score++;
          tsarr[i].place();
        }

        tsarr[i].update();
      }

      // get -1 point if user fails to hit target
      if(
        mouse && inGameView() && clicked &&
        getDistance(mouseX,mouseY,this.x,this.y) > this.radius
      ) {
        score--;
      }

      // stop
      if(timer <= 0) {

        window.clearInterval(timerID);
        state = 0;
        clicked = false; // fix -1 point on start bug

        // reset targets
        for(var i = 0; i < tsarr.length; i++) {
          tsarr[i].place();
        }


      }

    }

  ],

  shareRenderBefore: function() {

    if(buschimode) {
      ctx.drawImage(buschipic,0,fontSize+padding*3,canvas.width,canvas.height);
    }

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

  },

  shareRenderAfter: function() {

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

    // GAME
    function() {

      // render targets
      for(var i = 0; i < tsarr.length; i++) {
        tsarr[i].draw();
      }

      // render bushes
      for(var i = 0; i < bsarr.length; i++) {
        bsarr[i].draw();
      }

    }

  ]

};
