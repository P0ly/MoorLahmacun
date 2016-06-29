/*
  Moorbusch

  Copyright by Timo Häfner
*/

// TARGET

function Target(x, y, radius, img, type) {
  this.x = x;
  this.y = y;
  this.vy = 0;
  this.vx = 0;
  this.radius = radius;
  this.img = img;
  this.type = type;
}

Target.prototype.draw = function() {

  if(buschimode) {
    ctx.drawImage(
      this.img,
      this.x-this.radius,
      this.y-this.radius,
      this.radius*2,
      this.radius*2
    );
  } else {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius/2,0,Math.PI*2,true);
    ctx.fill();
  }

  if(devmode) {
    // target line
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(mouseX,mouseY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
  }

};

Target.prototype.update = function() {

    if(
      mouse && inGameView() && clicked &&
      getDistance(mouseX,mouseY,this.x,this.y) <= this.radius
    ) {
      score++;
      this.placeRandom();
    }

};

Target.prototype.placeRandom = function() {
  this.radius = getRandom(maxRadius,40);
  this.x = getRandom(canvas.width-this.radius,this.radius);
  this.y = getRandom(canvas.height-this.radius,this.radius+fontSize+padding*3);
};
