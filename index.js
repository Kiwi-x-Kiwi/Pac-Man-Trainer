// Object class for drawing obstacles based on arguments passed to constructor
class Obstacle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.fillStyle = "blue"
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

// Object class for Pac Man.  Holds its position, direction, and speed.  
// Size and velocity dependent on global variables.
class PacMan {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mouthGap = Math.PI / 4;  // Variable to control the mouth size
    this.verticalVelocity = 0;
    this.horizontalVelocity = 0;
    this.velocity = cellWidth / numOfTransitions;
    this.change = Math.PI / 16;
    this.queue = 0; // Variable to hold the user's directional input if it can't be executed immediately.
  }

  // Draw Pac Man
  draw() {
    const xCenter = this.x + this.radius;
    const yCenter = this.y + this.radius;
    const xOffset = this.radius * Math.cos(this.mouthGap);
    const yOffset = this.radius * Math.sin(this.mouthGap);
    let fill = this.radius - xOffset;
    ctx.beginPath();
    ctx.fillStyle = "yellow"; // Pac Man Color
    ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();

    // Draw mouth differently based on current direction.
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    if (this.verticalVelocity > 0) {
      fill = this.radius - xOffset;
      ctx.moveTo(xCenter - yOffset, yCenter + xOffset);
      ctx.lineTo(xCenter, yCenter);
      ctx.lineTo(xCenter + yOffset, yCenter + xOffset);
      ctx.fill();
      ctx.fillRect(xCenter - yOffset, yCenter + xOffset, yOffset * 2, fill);
    } else if (this.verticalVelocity < 0) {
      fill = this.radius - xOffset;
      ctx.moveTo(xCenter - yOffset, yCenter - xOffset);
      ctx.lineTo(xCenter, yCenter);
      ctx.lineTo(xCenter + yOffset, yCenter - xOffset);
      ctx.fill();
      ctx.fillRect(xCenter - yOffset, this.y, yOffset * 2, fill);
    } else if (this.horizontalVelocity > 0) {
      ctx.moveTo(xCenter + xOffset, yCenter - yOffset);
      ctx.lineTo(xCenter, yCenter);
      ctx.lineTo(xCenter + xOffset, yCenter + yOffset);
      ctx.fill();
      ctx.fillRect(xCenter + xOffset, yCenter - yOffset, fill, yOffset * 2);
    } else if (this.horizontalVelocity <= 0) {
      ctx.moveTo(xCenter - xOffset, yCenter - yOffset);
      ctx.lineTo(xCenter, yCenter);
      ctx.lineTo(xCenter - xOffset, yCenter + yOffset);
      ctx.fill();
      ctx.fillRect(this.x, yCenter - yOffset, fill, yOffset * 2);
    }

    ctx.closePath();
  }

  // Change Pac Man Direction
  changeDirection(direction) {
    pMan.queue = 0; // Reset queue value
    switch (direction) {
      case 38:
        this.horizontalVelocity = 0;
        this.verticalVelocity = -this.velocity;
        break;
      case 40:
        this.horizontalVelocity = 0;
        this.verticalVelocity = +this.velocity;
        break;
      case 37:
        this.verticalVelocity = 0;
        this.horizontalVelocity = -this.velocity;
        break;
      case 39:
        this.verticalVelocity = 0;
        this.horizontalVelocity = +this.velocity;
        break;
      // default:
      //   this.verticalVelocity = this.horizontalVelocity = 0;
      //   break;
    }
  }

  // Update x, y, and mouthGap
  move() {
    this.change = this.mouthGap == 0 ? -this.change : this.change;
    this.mouthGap = (this.mouthGap + this.change) % (Math.PI / 4) + Math.PI / 64;
    this.x += this.horizontalVelocity;
    this.y += this.verticalVelocity;
  }
}

// Object class designated for Ghost.
class Ghost {

}

// List of global variables.

let path = []; // Array to hold the path Pac Man has travelled in the maze.

// Generate game board
let board = MASTER_BOARD.map((subArr) => subArr.slice());

let cellWidth = 20; // Size of game images.
let speedOfGame = 50; // Speed at which canvas updates. The smaller the faster.
let numOfTransitions = 5; // Number of frames between each coordinate.
let frameCount = 0; // Number of frame since begining of game.
let score = 0;
const energizerRefresh = 5; // Rate of energizer flash.
let old_col, old_row;
let gamePath = cherryPath; // Path for Pac Man to follow.
let defaultSprite = dungeon;
let isPlaying = false; // Game has not started.
let guideOff = false; // Game has not started.
let id; // Game has not started.
let globalColor = "black"; // Game has not started.

// Constructor to initialize new Pac Man.  (x, y, size)
let pMan = new PacMan(14 * cellWidth, 23 * cellWidth, cellWidth / 2);

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
canvas.width = cellWidth * 28;
canvas.height = cellWidth * 31;

// Draws the game board based on the 2D array representation.
function drawBoard() {
  ctx.fillStyle = globalColor // Background color for the maze.
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let offset = cellWidth / 2;

  // Traverses the 2D array and draws elements based on array value.
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      ctx.fillStyle = "blue" // Wall color.
      // ctx.strokeStyle = "blue"
      const dimension = board[row][col];
      if (dimension == 1) {
        // ctx.fillRect(col * cellWidth, row * cellWidth, cellWidth + 0.8, cellWidth + 0.8);
      }
      else if (dimension == 0) {
        ctx.beginPath();
        ctx.fillStyle = "pink"; // Pellet Color
        ctx.arc(col * cellWidth + offset, row * cellWidth + offset, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
      } else if (dimension == 3 && (frameCount % 16 < energizerRefresh)) {
        ctx.beginPath();
        ctx.fillStyle = "pink"; // Energizere Color
        ctx.arc(col * cellWidth + offset, row * cellWidth + offset, 7, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
      }
    }
  }
  ctx.closePath();
}

function drawSprite(x, y, sprite = defaultSprite) {
  ctx.drawImage(sprite, x, y, cellWidth, cellWidth);
}

// Decorate the game board based on the 2D array representation.
function decorateBoard() {

  // Traverses the 2D array and draws elements based on array value.
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const dimension = board[row][col];
      if (dimension == 1) {
        drawSprite(col * cellWidth, row * cellWidth);
      }
    }
  }

}

// Traces the path denoted by an array of coordinates.
function drawPath(path = gamePath, color = "pink") {
  if(path == null) return;
  // Draws a new coordinate of the gamePath at a constant rate.
  const index = Math.floor(frameCount / numOfTransitions);
  if (index < path.length) drawPoint(path[index].y, path[index].x, color);

  // If it's the last coordinate of path, change color and stay still.
  else {
    const lastIndex = path.length - 1;
    ctx.fillStyle = "powderblue";
    drawSprite(path[lastIndex].x * cellWidth, path[lastIndex].y * cellWidth, scared_ghost);
  }
}

// Draws a rectangular outline at the designated row and col of the maze. 
function drawPoint(row, col, color) {
  ctx.strokeStyle = color; // Outline color.
  ctx.rect(col * cellWidth, row * cellWidth, cellWidth, cellWidth);
  ctx.stroke();
}

// Checks to see if Pac Man is at a full coordinate.
// Implemented to prevent accessing a decimal value of the array.
function atFullIndex() {
  return (pMan.x / cellWidth) % 1 === 0 && (pMan.y / cellWidth) % 1 === 0;
}

// Checks at each full coordinate if Pac Man can continue moving in
// current position and/or points need to be scored.
function checkCollision() {

  // Continues moving if not at full coordinate.
  if (!atFullIndex()) return false;

  pMan_row = pMan.y / cellWidth;
  pMan_col = pMan.x / cellWidth;

  // Checks one coordinate in front in relation to the current direction.
  if (pMan.horizontalVelocity > 0) pMan_col += 1;
  else if (pMan.horizontalVelocity < 0) pMan_col -= 1;
  if (pMan.verticalVelocity > 0) pMan_row += 1;
  else if (pMan.verticalVelocity < 0) pMan_row -= 1;

  // If at new coordinate, push current position into game path.
  if (old_row != pMan.x / cellWidth || old_col != pMan.y / cellWidth) {
    path.push({ x: pMan.x / cellWidth, y: pMan.y / cellWidth })
    old_row = pMan.x / cellWidth
    old_col = pMan.y / cellWidth
  }

  // Checks what the element is in the 2D array.
  let indexValue = board[pMan_row][pMan_col]

  if (indexValue == 1) {
    // Wall collision
    return true;
  } else if (indexValue === 0) {
    // Increment score for pellet and remove pellet from board.
    score += 10;
    board[pMan_row][pMan_col] = 2;
  } else if (indexValue === 3) {
    // Increment score for energizer and remove energizer from board.
    score += 50;
    board[pMan_row][pMan_col] = 2;
  }

  // Empty space, no collision.
  return false;
}

// Allow turn-around in the same direction. (e.g left/right, up/down).
function turnAround(keyCode) {
  switch (keyCode) {
    case 38: return (pMan.verticalVelocity > 0);
    case 40: return (pMan.verticalVelocity < 0);
    case 37: return (pMan.horizontalVelocity > 0);
    case 39: return (pMan.horizontalVelocity < 0);
  }
}

// Check to see if there is an obstacle in a given direction.
// Return true if there is an obstacle and return false if there is not.
function checkTurn(keyCode) {
  // Get Pac Man's current position in the 2D array.
  pMan_row = pMan.y / cellWidth;
  pMan_col = pMan.x / cellWidth;

  // Check 1 coordinate aheaed in the direction given.
  switch (keyCode) {
    case 38: return (board[pMan_row - 1][pMan_col] == 1);
    case 40: return (board[pMan_row + 1][pMan_col] == 1)
    case 37: return (board[pMan_row][pMan_col - 1] == 1)
    case 39: return (board[pMan_row][pMan_col + 1] == 1)
  }
}

// Teleports Pac Man if he travels through tunnel.
function tunnelCheck() {

  if (pMan.y == 14 * cellWidth && (pMan.x + cellWidth < 0 || pMan.x - cellWidth > canvas.width)) {
    pMan.x = (canvas.width - pMan.x);
    pMan.queue = 0;
    return true;
  }

}

// Surround Pac Man when player goes off the set path.
function surrounded(){  
  drawSprite(pMan.x, pMan.y - cellWidth * 1.3, blinkyDown)
  drawSprite(pMan.x, pMan.y + cellWidth * 1.3, inkyUp)
  drawSprite(pMan.x + cellWidth * 1.3, pMan.y, clydeLeft)
  drawSprite(pMan.x - cellWidth * 1.3, pMan.y, pinkyRight)
}

// Compare the player path and gamePath.
// Once veered off the path the player loses.
function checkPath(){
  if(gamePath == null || path.length < 1) return;

  const index = path.length -1;
  if (index < gamePath.length){
    if(path[index].y !== gamePath[index].y || path[index].x !== gamePath[index].x){
      clearInterval(id)
      surrounded();
      transitionAnalysis();
    }
  }else{
    console.log("Congrats, you've made it to the end");
    clearInterval(id);
  }
}

// Call drawPath on both set path and player path.
function animatePaths(){
  // Creating a shallow copy of the gamePath and move it forward by two.
  const tempPath = gamePath.slice(2);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  decorateBoard();

  // Differentiate player and gamePath by using different coloration.
  drawPath(path, "blue");
  drawPath(tempPath, "pink");
  frameCount++;
}

// Commpare the path the player has taken with set gamePath.
function comparePath(){
  clearInterval(id);
  frameCount = 0;

  id = setInterval(animatePaths, 30);
}

// Updates canvas, Pac Man position, and path position.
function updateCanvas() {
  let randIndex = Math.floor(Math.random()*ghostArray.length + 1);
  let randRow = Math.floor(Math.random()*board.length + 1);
  let randCol = Math.floor(Math.random()*board[0].length +1);

  // Draw static game elements.
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  decorateBoard();
  if(!guideOff) drawPath();

  if(frameCount % numOfTransitions === 0)   checkPath();

  // If Pac Man is in tunnel, teleport.
  tunnelCheck();

  // If there's a command in the queue check to see if it can be executed.
  if (pMan.queue !== 0 && atFullIndex() && checkTurn(pMan.queue) === false) {
    pMan.changeDirection(pMan.queue);
  }

  // If there's no collision continue moving Pac Man.
  if (checkCollision() != true) {
    pMan.move();
  }

  // Draw Pac Man.
  pMan.draw();

  frameCount++;
}

// Menu transitions
function transitionMenu(toggle) {
  const menu = document.getElementById("menu");
  const menuIcon = document.getElementById("menu-icon");

  const ghostDown = [
    "./sprites/original_ghosts/Blinky-Down.png", 
    "./sprites/original_ghosts/Pinky-Down.png", 
    "./sprites/original_ghosts/Inky-Down.png",
    "./sprites/original_ghosts/Clyde-Down.png"
  ]

  const ghostRight = [
    "./sprites/original_ghosts/Blinky-Right.png", 
    "./sprites/original_ghosts/Pinky-Right.png", 
    "./sprites/original_ghosts/Inky-Right.png",
    "./sprites/original_ghosts/Clyde-Right.png"
  ]
  
  const randIndex = Math.floor(Math.random()*4);

  // Expand/ collapse menu and swap out menu icon.
  if (menu.style.width == "50px" || toggle == "on") {
    
    menu.style.background = "rgb(70, 70, 150)";
    menu.style.width = "25vw";
    menu.style.height = "100vh";
    menuIcon.src = ghostDown[randIndex];
    menuIcon.style.width = "50px";
    menuIcon.style.height = "50px";
  }else {
    menu.style.background = "black";
    menu.style.width = "50px";
    menu.style.height = "50px";
    menuIcon.src = ghostRight[randIndex];
    menuIcon.style.width = "30px";
    menuIcon.style.height = "30px";
  }

}

// Restarts the game
function restart(){
  clearInterval(id);
  frameCount = 0;
  score = 0;
  isPlaying = false;
  guideOff = false;
  pMan.x = 14 * cellWidth;
  pMan.y = 23 * cellWidth;
  pMan.queue = 0;
  pMan.verticalVelocity = pMan.horizontalVelocity = 0;
  board = MASTER_BOARD.map((subArr) => subArr.slice());  

  path = [];

  toggleOptions();
  transitionAnalysis();
  transitionMenu("on");
}

// Analysis transitions
function transitionAnalysis() {
  const analysis = document.getElementById("analysis");
  const analysisIcon = document.getElementById("analysis-icon");
  const analyzeButton = document.getElementById("analyze").onclick = comparePath;
  const restartButton = document.getElementById("restart").onclick = restart;

  const ghostDown = [
    "./sprites/original_ghosts/Blinky-Down.png", 
    "./sprites/original_ghosts/Pinky-Down.png", 
    "./sprites/original_ghosts/Inky-Down.png",
    "./sprites/original_ghosts/Clyde-Down.png"
  ]

  const ghostLeft = [
    "./sprites/original_ghosts/Blinky-Left.png", 
    "./sprites/original_ghosts/Pinky-Left.png", 
    "./sprites/original_ghosts/Inky-Left.png",
    "./sprites/original_ghosts/Clyde-Left.png"
  ]
  
  const randIndex = Math.floor(Math.random()*4);

  // Expand/ collapse menu and swap out menu icon.
  if (analysis.style.width !== "25vw") {
    analysis.style.background = "rgb(70, 70, 150)";
    analysis.style.width = "25vw";
    analysis.style.height = "100vh";
    analysisIcon.src = ghostDown[randIndex];
    analysisIcon.style.width = "50px";
    analysisIcon.style.height = "50px";
  }else {
    analysis.style.background = "black";
    analysis.style.width = "0";
    analysis.style.height = "0";
    analysisIcon.src = ghostLeft[randIndex];
    analysisIcon.style.width = "30px";
    analysisIcon.style.height = "30px";
  }

}

// Disable options mid-game
function toggleOptions(){
  if(isPlaying){
    document.querySelector("#start").disabled = true;
    document.getElementById("path").disabled = true;
    document.getElementById("speed").disabled = true;
    document.getElementById("guide").disabled = true;
    document.getElementById("display").disabled = true;
    // document.getElementById("start").style.display = "none";
    // document.getElementById("start2").style.display = "block";
    // document.getElementById("background").disabled = true;
    // document.getElementById("size").disabled = true;
  }else{
    document.querySelector("#start").disabled = false;
    document.getElementById("path").disabled = false;
    document.getElementById("speed").disabled = false;
    document.getElementById("guide").disabled = false;
    document.getElementById("display").disabled = false;
    // document.getElementById("start").style.display = "block";
    // document.getElementById("start2").style.display = "none";
    // document.getElementById("background").disabled = true;
    // document.getElementById("size").disabled = true;
  }
}

window.onload = function () {
  // Start the music
  (function(src = "./audio/Lavender_Town.mp3"){
    let bgm = document.getElementById("bgm");
    bgm.loop = true;    
  })()

  // Loads the Initial Board.
  const menu = document.getElementById("menu");
  const menuIcon = document.getElementById("menu-icon");
  const analysisIcon = document.getElementById("analysis-icon");

  const pathSelector = document.getElementById("path").onchange = function(e){
    switch(e.target.value){
      case "cherryPath": gamePath = cherryPath; break;
      case "midFruitPath": gamePath = midFruitPath; break;
      case "applePath": gamePath = applePath; break;
      default: gamePath = null;
    }
  };
  const speedSelector = document.getElementById("speed").onchange = function (e) {
    speedOfGame = Number(e.target.value);
  };
  const guideSelector = document.getElementById("guide").onchange = function(e){
    switch(e.target.value){
      case "off": guideOff = true; break;
      case "box": guideOff = false; break;
    }
  };
  const displaySelector = document.getElementById("display").onchange = function (e) {
    switch (e.target.value) {
      case "dungeon": defaultSprite = dungeon; break;
      case "starry": defaultSprite = starry; break;
      case "cave": defaultSprite = cave; break;
      case "lava": defaultSprite = lava; break;
      case "stone": defaultSprite = stone; break;
      case "redbrick": defaultSprite = redbrick; break;
    }
    decorateBoard();
  };
  // const backgroundSelector = document.getElementById("background").onchange = function (e) {
  //   globalColor = e.target.value;
  //   drawBoard();
  //   decorateBoard();
  // };
  // const sizeSelector = document.getElementById("size").onchange = function (e) {
  //   switch (e.target.value) {
  //     case "large": cellWidth = 25; break;
  //     case "small": cellWidth = 20; break;
  //   }
  // };

  drawBoard();
  decorateBoard();
  pMan.draw();

  // Collapse/expand menu.
  menuIcon.onclick = transitionMenu;
  analysisIcon.onclick = transitionAnalysis;
  analysisIcon.onclick = restart;
  // document.getElementById("start2").onclick = function(){
  //   clearInterval(id);
  //   restart();
  //   transitionAnalysis();
  // }

  // Start game.
  document.querySelector("#start").onclick = function () {
    // Auto-collapse menu.
    transitionMenu();
  
    isPlaying = true;  // Game has started.
    toggleOptions() // Turn off game options to prevent runtime errors.

    document.onkeydown = function (e) {
      // Checks to see if directional input can be executed.
      if (turnAround(e.keyCode) === true) {
        // If opposite of current direction excute.
        pMan.changeDirection(e.keyCode)
        updateCanvas();
      } else if (atFullIndex()) {
        if (checkTurn(e.keyCode) && e.keyCode < 41 && e.keyCode > 36) {
          // If at full coordinate but there is obstacles in the inputted
          // direction, hold the command in queue until it can be executed.
          pMan.queue = e.keyCode;
        } else {
          // If at full coordinate and there is no obstacle in the inputted
          // direction, immediately execute.
          pMan.changeDirection(e.keyCode)
          updateCanvas();
        }

      } else if (e.keyCode < 41 && e.keyCode > 36) {
        // If not at full coordinate, hold command in queue.
        pMan.queue = e.keyCode;
      }
    }

    id = setInterval(updateCanvas, speedOfGame);
  }
}