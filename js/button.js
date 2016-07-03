/*
  Moorbusch

  Copyright by Timo Häfner
*/

// BUTTON
function start() {
  state = 1;
  startTime = Date.now();
  reset();
  document.getElementById("playbutton").value = "Restart";
}
