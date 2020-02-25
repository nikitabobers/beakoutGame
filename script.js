const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let score = 0;
let row = 1;
let column = 4;

// Set parameters
const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  r: 10,
  speed: 4,
  dx: 4,
  dy: -4
};

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  w: 80,
  h: 10,
  speed: 8,
  dx: 0
};

let bricks = [];
for (let i = 0; i < column; i++) {
  bricks[i] = []; //create columns
  for (let j = 0; j < row; j++) {
    //create element in each column
    //XY parameters
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    // Set parameters in Array
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

// Draw elements on canvas
function createBrick() {
  bricks.forEach(row => {
    row.forEach(brick => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#ba8cd7" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
}
function createBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = "#ba8cd7";
  ctx.fill();
  ctx.closePath();
}
function createPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = "#ba8cd7";
  ctx.fill();
  ctx.closePath();
}

// Animation
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.r > canvas.width || ball.x - ball.r < 0) {
    ball.dx *= -1;
  }
  if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0) {
    ball.dy *= -1;
  }

  // Paddle
  if (ball.x - ball.r > paddle.x && ball.x + ball.r < paddle.x + paddle.w && ball.y + ball.r > paddle.y) {
    ball.dy = -ball.speed;
  }

  // Brick
  bricks.forEach(row => {
    row.forEach(brick => {
      if (brick.visible) {
        if (
          ball.x - ball.r > brick.x &&
          ball.x + ball.r < brick.x + brick.w &&
          ball.y + ball.r > brick.y &&
          ball.y - ball.r < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;

          scoreUp();
        }
      }
    });
  });
  //   Hit bottom wall
  if (ball.y + ball.r > canvas.height) {
    showAllBricks();
  }
}
function movePaddle() {
  paddle.x += paddle.dx;

  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  if (paddle.x < 0) {
    paddle.x = 0;
  }
}

function showAllBricks() {
  bricks.forEach(row => {
    row.forEach(brick => (brick.visible = true));
  });
  score = 0;
}

function scoreUp() {
  score++;
  if (score % (row * column) === 0) {
    levelUp();
  }
}
function levelUp() {
  //   for (let i = 2; i < 10; i++) {
  //     row = [i];
  //   }
  row = 2;
  bricks.forEach(row => {
    row.forEach(brick => (brick.visible = true));
  });

  score = 0;
}
function drawScore() {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  createBrick();
  createBall();
  createPaddle();
  drawScore();
}
function update() {
  moveBall();
  movePaddle();
  requestAnimationFrame(update);
  draw();
}
update();

// Press key
function keyDown(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
}

function keyUp(e) {
  if (e.key === "Right" || e.key === "ArrowRight" || e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = 0;
  }
}
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
