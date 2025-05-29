// Flappy Cinnamoroll Game Logic
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load sound effects
const jumpSound = new Audio("wing.ogg");
const gameOverSound = new Audio("die.ogg");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const tutorialScreen = document.getElementById("tutorialScreen");
const tutorialBtn = document.getElementById("tutorialBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreEl = document.getElementById("finalScore");
const refreshBtn = document.getElementById("refreshBtn");
const exitBtn = document.getElementById("exitBtn");
const groundImage = document.getElementById("groundImage");

const cinnamoroll = { x: 80, y: window.innerHeight / 2, width: 80, height: 60 };
let pipes = [];
const pipeWidth = 40;
const gap = 150;
let pipeSpeed = 1.5;
const gravity = 0.3;
const jumpStrength = -6;
let velocityY = 0;
let score = 0;
let gameOver = false;
let gameStarted = false;

const cinnamorollImage = new Image();
const pipeTopImage = new Image();
const pipeBottomImage = new Image();

cinnamorollImage.src = "icon cinnamoroll.png";
pipeTopImage.src = "pipa-atas.jpg";
pipeBottomImage.src = "pipe-red.png";

let imagesLoaded = 0;
const totalImages = 3;

function checkImagesLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    showStartScreen();
  }
}

cinnamorollImage.onload = checkImagesLoaded;
pipeTopImage.onload = checkImagesLoaded;
pipeBottomImage.onload = checkImagesLoaded;

function showStartScreen() {
  if (!gameStarted) {
    startScreen.style.display = "block";
  }
}

function resetGame() {
  cinnamoroll.y = canvas.height / 2;
  velocityY = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  gameStarted = false;
  gameOverScreen.style.display = "none";
  pipeSpeed = 1.5;
  groundImage.style.display = "block";
}

function spawnPipe() {
  const maxPipeTopHeight = canvas.height - gap - 150;
  const topHeight =
    Math.floor(Math.random() * (maxPipeTopHeight - 50 + 1)) + 50;
  let bottomHeight = canvas.height - topHeight - gap;
  if (bottomHeight > canvas.height - 100) {
    bottomHeight = canvas.height - 100;
  }
  if (bottomHeight < 50) {
    bottomHeight = 50;
  }
  pipes.push({
    x: canvas.width,
    topY: 0,
    topHeight: topHeight,
    bottomY: canvas.height - bottomHeight,
    bottomHeight: bottomHeight,
    passed: false,
  });
}

function drawCinnamoroll() {
  ctx.drawImage(
    cinnamorollImage,
    cinnamoroll.x,
    cinnamoroll.y,
    cinnamoroll.width,
    cinnamoroll.height
  );
}

function drawPipes() {
  pipes.forEach((pipe) => {
    ctx.drawImage(pipeTopImage, pipe.x, pipe.topY, pipeWidth, pipe.topHeight);
    ctx.drawImage(
      pipeBottomImage,
      pipe.x,
      pipe.bottomY,
      pipeWidth,
      pipe.bottomHeight
    );
  });
}

function checkCollision() {
  if (
    cinnamoroll.y + cinnamoroll.height > canvas.height - 100 ||
    cinnamoroll.y < 0
  ) {
    return true;
  }
  for (let pipe of pipes) {
    if (
      cinnamoroll.x + cinnamoroll.width > pipe.x &&
      cinnamoroll.x < pipe.x + pipeWidth
    ) {
      if (
        cinnamoroll.y < pipe.topHeight ||
        cinnamoroll.y + cinnamoroll.height > pipe.bottomY
      ) {
        return true;
      }
    }
  }
  return false;
}

let animationFrameId;
function update() {
  if (gameOver) {
    cancelAnimationFrame(animationFrameId);
    return;
  }
  if (gameStarted) {
    velocityY += gravity;
    cinnamoroll.y += velocityY;
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].x -= pipeSpeed;
      if (!pipes[i].passed && pipes[i].x + pipeWidth < cinnamoroll.x) {
        pipes[i].passed = true;
        score++;
        pipeSpeed += 0.1;
      }
      if (pipes[i].x + pipeWidth < 0) {
        pipes.splice(i, 1);
        i--;
      }
    }
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
      spawnPipe();
    }
  }
  if (checkCollision()) {
    gameOver = true;
    finalScoreEl.textContent = score;
    gameOverSound.play();
    gameOverScreen.style.display = "block";
  }
  draw();
  animationFrameId = requestAnimationFrame(update);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPipes();
  drawCinnamoroll();
  if (gameStarted) {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText(score, canvas.width / 2, 60);
  }
}

function jump() {
  if (gameOver) return;
  if (!gameStarted) {
    gameStarted = true;
    tutorialScreen.style.display = "none";
  }
  velocityY = jumpStrength;
  jumpSound.play();
}

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jump();
  }
});

canvas.addEventListener("click", jump);

startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  tutorialScreen.style.display = "block";
});

tutorialBtn.addEventListener("click", () => {
  tutorialScreen.style.display = "none";
  resetGame();
  update();
});

refreshBtn.addEventListener("click", () => {
  gameOverScreen.style.display = "none";
  resetGame();
  update();
});

exitBtn.addEventListener("click", () => {
  gameOverScreen.style.display = "none";
  resetGame();
  startScreen.style.display = "block";
});
