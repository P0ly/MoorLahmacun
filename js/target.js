/*
  Moorbusch

  Copyright by Timo Häfner
*/

// TARGET

var Target = function() {
  this.x = 0;
  this.y = 0;
  this.vy = 0;
  this.vx = 0;
  this.radius = getRandom(minRadius,maxRadius);
  this.img = buschipic;
  this.speed = targetSpeed;
  this.alive = true;
};

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

Target.prototype.isHit = function() {

    if(
      mouse && inGameView() && clicked &&
      getDistance(mouseX,mouseY,this.x,this.y) <= this.radius+playerRadius
    ) {
      this.alive = false;
      score++;
      hits++;
      return true;
    }

    for(var i = 0; i < touches.length; i++) {
      if(
        touch && inGameView() && clicked &&
        getDistance(touches[i].pageX,touches[i].pageY,this.x,this.y) <= this.radius+playerRadius
      ) {
        this.alive = false;
        score++;
        hits++;
        return true;
      }
    }

    return false;

};

Target.prototype.shareUpdate = function() {

  if(this.alive) {
    this.isHit();
    this.update();
  } else {
    this.vy = this.speed*4;
    if(this.y >= canvas.height) {
      this.vy = 0;
      this.place();
    }
  }

  this.x += this.vx;
  this.y += this.vy;

};


var FlyTarget = function() {};
FlyTarget.prototype = new Target();

FlyTarget.prototype.update = function() {

  if(this.x-this.radius > canvas.width) this.place();

};

FlyTarget.prototype.place = function() {

  this.alive = true;
  this.vx = this.speed;

  this.x = getRandom(-(this.radius), -(canvas.width/2));
  this.y = getRandom(
    this.radius+fontSize+padding*3,
    canvas.height-this.radius-bushMaxHeight
  );

};

var HideTarget = function() {};
HideTarget.prototype = new Target();

HideTarget.prototype.update = function() {

  if(this.y < canvas.height-bushMaxHeight-this.radius/2) {
    this.vy = this.speed;
  }
  if(this.vy > 0 && this.y > canvas.height) {
    this.place();
  }

};

HideTarget.prototype.place = function() {

  this.alive = true;
  this.vy = -(this.speed*0.5);

  this.x = getRandom(this.radius, canvas.width-this.radius);
  this.y = getRandom(
    canvas.height+this.radius,
    canvas.height+this.radius+bushMaxHeight
  );

};
