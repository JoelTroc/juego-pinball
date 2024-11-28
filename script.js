const canvas = document.getElementById('pinballCanvas');
const ctx = canvas.getContext('2d');
const scoreboard = document.getElementById('scoreboard');
const playersList = document.getElementById('playersList');
let ball, paddle, rightPressed, leftPressed, bricks, rowCount, columnCount, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft, score, lives, playerName, difficultyIncrement;

function initializeGameVariables() {
  ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 3, // Velocidad inicial de la pelota
    dy: -3, // Velocidad inicial de la pelota
    radius: 10
  };
  paddle = {
    height: 10,
    width: 75, // Ancho inicial del paddle
    x: (canvas.width - 75) / 2
  };
  rightPressed = false;
  leftPressed = false;
  bricks = [];
  rowCount = 5;
  columnCount = 7;
  brickWidth = 75;
  brickHeight = 20;
  brickPadding = 10;
  brickOffsetTop = 30;
  brickOffsetLeft = 30;
  score = 0;
  lives = 3;
  difficultyIncrement = 0.05; // Incremento de dificultad

  for (let c = 0; c < columnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < rowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function startGame() {
  playerName = document.getElementById('playerName').value;
  if (!playerName) {
    alert('Por favor, ingrese un nombre de jugador.');
    return;
  }
  document.getElementById('playerForm').style.display = 'none';
  canvas.style.display = 'block';
  initializeGameVariables();
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);
  document.addEventListener('mousemove', mouseMoveHandler, false);
  draw();
}

function keyDownHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2;
  }
}

function collisionDetection() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      let b = bricks[c][r];
      if (b.status === 1) {
        if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
          ball.dy = -ball.dy;
          b.status = 0;
          score++;
          if (score % 10 === 0) { // Aumentar la dificultad cada 10 puntos
            increaseDifficulty();
          }
          if (score === rowCount * columnCount) {
            alert('¡Felicidades, has ganado!');
            savePlayer();
            document.location.reload();
          }
        }
      }
    }
  }
}

function increaseDifficulty() {
  if (paddle.width > 50) {
    paddle.width -= 5; // Reducir el tamaño del paddle
  }
  ball.dx *= 1 + difficultyIncrement;
  ball.dy *= 1 + difficultyIncrement;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < columnCount; c++) {
    for (let r = 0; r < rowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = '#0095DD';
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawScore() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Puntuación: ' + score, 8, 20);
}

function drawLives() {
  ctx.font = '16px Arial';
  ctx.fillStyle = '#fff';
  ctx.fillText('Vidas: ' + lives, canvas.width - 65, 20);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawScore();
  drawLives();
  collisionDetection();

  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
    } else {
      lives--;
      if (!lives) {
        alert('Juego Terminado');
        savePlayer();
        document.location.reload();
      } else {
        ball.x = canvas.width / 2;
        ball.y = canvas.height - 30;
        ball.dx = 3; // Reiniciar la velocidad de la pelota
        ball.dy = -3; // Reiniciar la velocidad de la pelota
        paddle.x = (canvas.width - paddle.width) / 2;
      }
    }
  }

  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 7;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= 7;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;
  requestAnimationFrame(draw);
}

function savePlayer() {
  const player = { name: playerName, score: score };
  let players = JSON.parse(localStorage.getItem('players')) || [];
  players.push(player);
  localStorage.setItem('players', JSON.stringify(players));
  alert(`Jugador ${playerName} guardado con éxito con una puntuación de ${score}!`);
  updatePlayersList(players);
}

function fetchPlayers() {
  let players = JSON.parse(localStorage.getItem('players')) || [];
  updatePlayersList(players);
}

function updatePlayersList(players) {
  playersList.innerHTML = '';
  players.forEach(player => {
    const li = document.createElement('li');
    li.textContent = `${player.name}: ${player.score}`;
    playersList.appendChild(li);
  });
}

initializeGameVariables(); // Asegúrate de inicializar variables antes de empezar

