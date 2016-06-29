/*
  Moorbusch

  Copyright by Timo Häfner
*/

// BUTTON

function Button(x,y,text,func) {
  this.text = text;
  this.func = func;
  this.x = x;
  this.y = y;
  this.width = (fontSize*this.text.length*0.9);
  this.height = (fontSize+padding*3);
}

Button.prototype.draw = function () {
  if(isAABBC(
      this.x-padding,
      this.y-fontSize,
      this.width,
      this.height,
      mouseX,
      mouseY,
      1,
      1
  )) {
    ctx.fillStyle = colorHover;
  } else {
    ctx.fillStyle = color;
  }
  ctx.fillRect(this.x-padding,this.y-fontSize,this.width,this.height);
  ctx.fillStyle = fontColor;
  ctx.font =  fontSize + 'px ' + font;
  ctx.fillText(this.text,this.x+padding,this.y+padding);
};

Button.prototype.update = function() {
  if(isAABBC(
    this.x-padding,
    this.y-fontSize,
    this.width,
    this.height,
    mouseX,
    mouseY,
    1,
    1
  ) && mouse && clicked) {
    this.func();
  }
};

Button.prototype.reCal = function() {
  this.width = (fontSize*this.text.length*0.9);
  this.height = (fontSize+padding*3);
};
