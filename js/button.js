/*
  Moorbusch

  Copyright by Timo Häfner
*/

// BUTTON

function Button(x,y,width,height,text,func) {
  this.text = text;
  this.func = func;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  // this.width = (fontSize*this.text.length*0.9);
  // this.height = (fontSize+padding*3);
}

Button.prototype.draw = function () {
  if(isAABBC(
    this.x-padding,this.y-fontSize,this.width,this.height,
    mouseX-playerRadius, mouseY-playerRadius, playerRadius*2, playerRadius*2
  )) {
    ctx.fillStyle = colorHover;
  } else {
    ctx.fillStyle = color;
  }
  ctx.fillRect(this.x-padding,this.y-fontSize,this.width,this.height);
  ctx.fillStyle = fontColor;
  ctx.font =  fontSize*this.width/250 + 'px ' + font;
  ctx.fillText(
    this.text,
    this.x+padding+this.width/2-this.text.length*fontSize,
    this.y+padding+this.height/4
  );
};

Button.prototype.update = function() {
  if(mouse || touch && clicked) {
    if(isAABBC(
      this.x-padding, this.y-fontSize, this.width, this.height,
      mouseX-playerRadius, mouseY-playerRadius, playerRadius*2, playerRadius*2
    )) {
      this.func();
    }
    for(var i = 0; i < touches.length; i++) {
      if(isAABBC(
        this.x-padding,this.y-fontSize,this.width,this.height,
        touches[i].pageX-playerRadius, touches[i].pageY-playerRadius, playerRadius*2, playerRadius*2
      )) {
        ctx.fillStyle = colorHover;
        this.func();
      }
    }
  }
};

Button.prototype.reCal = function() {
  this.width = (fontSize*this.text.length*0.9);
  this.height = (fontSize+padding*3);
};
