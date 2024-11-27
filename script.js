document.addEventListener('DOMContentLoaded', function () {
    let score = 0;
    const player = document.getElementById('player');
    const ball = document.getElementById('ball');
    const scoreDisplay = document.getElementById('score');

    let playerPosition = 200; // Posición inicial del jugador
    let ballPosition = { x: Math.random() * (500 - 20), y: 0 }; // Posición inicial de la pelota
    let ballSpeed = { x: 2, y: 5 }; // Velocidad inicial de la pelota

    // Detectar movimiento táctil
    let touchStartX = 0;

    document.getElementById('gameArea').addEventListener('touchstart', function (event) {
        touchStartX = event.touches[0].clientX;
    });

    document.getElementById('gameArea').addEventListener('touchmove', function (event) {
        const touchEndX = event.touches[0].clientX;
        const touchDelta = touchEndX - touchStartX;

        if (touchDelta > 10 && playerPosition < 400) {
            playerPosition += 20;
        } else if (touchDelta < -10 && playerPosition > 0) {
            playerPosition -= 20;
        }

        player.style.left = playerPosition + 'px';
    });

    // Detectar movimiento con teclas de flecha
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowRight' && playerPosition < 400) {
            playerPosition += 20;
        } else if (event.key === 'ArrowLeft' && playerPosition > 0) {
            playerPosition -= 20;
        }
        player.style.left = playerPosition + 'px';
    });

    // Configurar posición inicial de la pelota
    ball.style.left = ballPosition.x + 'px';
    ball.style.top = ballPosition.y + 'px';

    // Función para mover la pelota
    function moveBall() {
        ballPosition.x += ballSpeed.x;
        ballPosition.y += ballSpeed.y;

        // Actualizar la posición de la pelota en el DOM
        ball.style.left = ballPosition.x + 'px';
        ball.style.top = ballPosition.y + 'px';

        // Rebotar contra los bordes laterales
        if (ballPosition.x <= 0 || ballPosition.x >= 480) {
            ballSpeed.x *= -1; // Cambiar la dirección horizontal
        }

        // Rebotar contra la barra
        if (
            ballPosition.y >= 560 && // Justo por encima de la barra
            ballPosition.y <= 580 && // Asegurar el rango de contacto
            ballPosition.x >= playerPosition &&
            ballPosition.x <= playerPosition + 100
        ) {
            ballSpeed.y = -Math.abs(ballSpeed.y); // Asegurar rebote hacia arriba
            score++; // Incrementar puntaje
            scoreDisplay.textContent = 'Puntaje: ' + score;
        }

        // Si la pelota cae fuera del área, reiniciar
        if (ballPosition.y > 600) {
            resetBall();
        }

        // Si la pelota rebota en la parte superior
        if (ballPosition.y <= 0) {
            ballSpeed.y = Math.abs(ballSpeed.y); // Cambiar dirección hacia abajo
        }
    }

    // Función para reiniciar la pelota y los puntos
    function resetBall() {
        ballPosition = { x: Math.random() * (500 - 20), y: 0 };
        ballSpeed = { x: 2, y: 5 }; // Velocidad inicial
        ball.style.left = ballPosition.x + 'px';
        ball.style.top = ballPosition.y + 'px';
        score = 0; // Reiniciar puntaje
        scoreDisplay.textContent = 'Puntaje: ' + score;
    }

    // Mover la pelota cada 20ms
    setInterval(moveBall, 20);
});
