/*
  Moorbusch

  Copyright by Timo Häfner
*/

// STATES

// 0 = MENU
// 1 = GAME

var states = {

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

  render: [

    // MENU
    function() {

      if(buschimode) {
        ctx.drawImage(buschipic,0,0,canvas.width,canvas.height);
      }

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

      if(buschimode) {
        ctx.drawImage(buschipic,0,0,canvas.width,canvas.height);
      }

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
