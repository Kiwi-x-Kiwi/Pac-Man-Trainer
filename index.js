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

class PacMan {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mouthGap = 0;
    this.verticalVelocity = 0;
    this.horizontalVelocity = 0;
    this.velocity = cellWidth/speedOfGame;
    this.change = Math.PI / 16;
    this.queue = 0;
  }

  draw() {
    const xCenter = this.x + this.radius;
    const yCenter = this.y + this.radius;
    const xOffset = this.radius * Math.cos(this.mouthGap);
    const yOffset = this.radius * Math.sin(this.mouthGap);
    let fill = this.radius - xOffset;
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    if (this.horizontalVelocity < 0) {
      ctx.moveTo(xCenter - xOffset, yCenter - yOffset);
      ctx.lineTo(xCenter, yCenter);
      ctx.lineTo(xCenter - xOffset, yCenter + yOffset);
      ctx.fill();
      ctx.fillRect(this.x, yCenter - yOffset, fill, yOffset * 2);
    } else if (this.horizontalVelocity > 0) {
      ctx.moveTo(xCenter + xOffset, yCenter - yOffset);
      ctx.lineTo(xCenter, yCenter);
      ctx.lineTo(xCenter + xOffset, yCenter + yOffset);
      ctx.fill();
      ctx.fillRect(xCenter + xOffset, yCenter - yOffset, fill, yOffset * 2);
    } else if (this.verticalVelocity > 0) {
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
    }

    ctx.closePath();

  }

  changeDirection(direction) {
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
      default:
        this.verticalVelocity = this.horizontalVelocity = 0;
        break;
    }
  }

  move() {
    this.change = this.mouthGap == 0 ? -this.change : this.change;
    this.mouthGap = (this.mouthGap + this.change) % (Math.PI / 4);
    this.x += this.horizontalVelocity;
    this.y += this.verticalVelocity;
  }
}

class Ghost {

}

let board =
  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
  ];

let speedOfGame = 5;

let old_row = 0;
let old_col = 0;

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const cellWidth = 25;
canvas.width = cellWidth * 28;
canvas.height = cellWidth * 31;

let pMan = new PacMan(14 * cellWidth, 23 * cellWidth, cellWidth / 2);

function drawBoard() {
  ctx.fillStyle = "black"
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  let offset = cellWidth / 2;

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      ctx.fillStyle = "blue"
      ctx.strokeStyle = "blue"
      const dimension = board[row][col];
      if (dimension == 1) ctx.fillRect(col * cellWidth, row * cellWidth, cellWidth + 0.8, cellWidth + 0.8);
      else if (dimension == 0) {
        ctx.beginPath();
        ctx.fillStyle = "pink";
        ctx.arc(col * cellWidth + offset, row * cellWidth + offset, 2, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.closePath();
      }
    }
  }
  ctx.closePath();
}

function drawReferencePoint(row, col) {
  ctx.strokeStyle = "white";
  ctx.font = "10px Arial";

  ctx.rect(col * cellWidth, row * cellWidth, cellWidth, cellWidth);
  ctx.stroke();
  ctx.fillText(col + " " + row, cellWidth, cellWidth, cellWidth);
  // ctx.fill
}

function checkCollision() {

  if((pMan.x / cellWidth) % 1 !== 0){
    // console.log("moving along x");
    return false;
  } else if ((pMan.y / cellWidth) % 1 !== 0){
    // console.log("moving along y");
    return false;
  }
  
  pMan_row = pMan.y / cellWidth;
  pMan_col = pMan.x / cellWidth;

  if(pMan.horizontalVelocity > 0) pMan_col += 1;
  else if(pMan.horizontalVelocity < 0) pMan_col -= 1;
  if(pMan.verticalVelocity > 0) pMan_row += 1;
  else if(pMan.verticalVelocity < 0) pMan_row -= 1;


  if (old_row != pMan_row || old_col != pMan_col) {
    // console.log(pMan_row);
    // console.log(pMan_col);
  }

  old_row = pMan_row
  old_col = pMan_col

  // drawReferencePoint(pMan_row, pMan_col)

  if (board[pMan_row][pMan_col] == 1) {
    // console.log("collision");
    return true;
  } else if (board[pMan_row][pMan_col] == 0){
    board[pMan_row][pMan_col] = 2;
  }

  // console.log("collision");
  return false;
}

function turnAround(keyCode) {
  switch(keyCode){
    case 38: return (pMan.verticalVelocity > 0);
    case 40: return (pMan.verticalVelocity < 0);
    case 37: return (pMan.horizontalVelocity > 0);
    case 39: return (pMan.horizontalVelocity < 0);
  }
}

function updateCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
  // drawReferencePoint(13, 20)
  if(checkCollision() != true){
    pMan.move();
  }
  pMan.draw();
  // requestAnimationFrame(updateCanvas);
}

window.onload = function () {
  drawBoard();
  // drawPoints();
  pMan.draw();

  document.onkeydown = function (e) {
    // console.log(e.keyCode);
    if(turnAround(e.keyCode) === true){
      // console.log("Turn around" + pMan.x + " " + pMan.y);
      pMan.changeDirection(e.keyCode)
      updateCanvas();
    }else if ((pMan.x / cellWidth) % 1 === 0 && (pMan.y / cellWidth) % 1 === 0){
      // console.log(pMan.x + " " +pMan.y);
      pMan.changeDirection(e.keyCode)
      updateCanvas();
    }else{
      pMan.queue = e.keyCode;
    }    
  }

  setInterval(updateCanvas, 100);
  // requestAnimationFrame(updateCanvas);
}