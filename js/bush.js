/*
  Moorbusch

  Copyright by Timo Häfner
*/

// BUSH

function Bush(x, y, radius, color) {

  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.show = true;
  this.lastSpawn = Date.now();
  
}

Bush.prototype.draw = function() {

  if(this.show) {
    ctx.fillStyle = 'darkgreen';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,true);
    ctx.fill();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius*0.9,0,Math.PI*2,true);
    ctx.fill();
  }

};

Bush.prototype.update = function() {

  if(Date.now()-this.lastSpawn >= bushSpawn) this.show = true;
  if(
    mousemode && this.show && mouse && clicked &&
    getDistance(mouseX,mouseY,this.x,this.y) <= this.radius+playerRadius
  ) {
    this.show = false;
    hits++;
    this.lastSpawn = Date.now();
  }

  for(var i = 0; i < touches.length; i++) {
    if(
      touch && inGameView() && clicked &&
      getDistance(touches[i].pageX,touches[i].pageY,this.x,this.y) <= this.radius+playerRadius
    ) {
      this.show = false;
      hits++;
      this.lastSpawn = Date.now();
    }
  }

};
