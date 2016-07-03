/*
  Moorbusch

  Copyright by Timo Häfner
*/

// BUTTON
function start() {
  state = 1;
  score = 0;
  startTime = Date.now();
  document.getElementById("playbutton").value = "Restart";
}
