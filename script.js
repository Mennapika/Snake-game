const grid = document.getElementById('grid');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');

const width = 15;
let squares = [];
let snake = [2,1,0];
let direction = 1;
let appleIndex = 0;
let intervalTime = 300;
let timerId;
let score = 0;

// Load best score from localStorage
let bestScore = localStorage.getItem('bestScore') || 0;
bestScoreDisplay.textContent = bestScore;

// Create grid dynamically
function createGrid() {
    grid.innerHTML = '';
    squares = [];
    for(let i=0; i<width*width; i++){
        const square = document.createElement('div');
        square.classList.add('square');
        grid.appendChild(square);
        squares.push(square);
    }
}

// Draw snake
function drawSnake() {
    snake.forEach((index, i) => {
        squares[index].classList.add('snake');
        if(i === 0) squares[index].classList.add('snake-head');
        else squares[index].classList.remove('snake-head');
    });
}

// Move snake
function move() {
    const tail = snake.pop();
    squares[tail].classList.remove('snake', 'snake-head');
    const head = snake[0] + direction;

    // Collision detection
    if (
        head < 0 || head >= width*width ||
        (direction === 1 && head % width === 0) ||
        (direction === -1 && (head+1) % width === 0) ||
        squares[head].classList.contains('snake')
    ) {
        clearInterval(timerId);
        alert(`Game Over! Final Score: ${score}`);
        if(score > bestScore){
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
            bestScoreDisplay.textContent = bestScore;
        }
        return;
    }

    snake.unshift(head);

    // Apple collision
    if(squares[head].classList.contains('apple')){
        squares[head].classList.remove('apple');
        squares[tail].classList.add('snake'); // grow
        snake.push(tail);
        score++;
        scoreDisplay.textContent = score;
        generateApple();
        clearInterval(timerId);
        intervalTime *= 0.9; // speed up
        timerId = setInterval(move, intervalTime);
    }

    drawSnake();
}

// Generate apple
function generateApple() {
    do {
        appleIndex = Math.floor(Math.random() * squares.length);
    } while(squares[appleIndex].classList.contains('snake'));
    squares[appleIndex].classList.add('apple');
}

// Controls
function control(e) {
    if(e.keyCode === 39) direction = 1;       // right
    else if(e.keyCode === 38) direction = -width; // up
    else if(e.keyCode === 37) direction = -1; // left
    else if(e.keyCode === 40) direction = width; // down
}

// Start game
function startGame() {
    snake.forEach(index => squares[index].classList.remove('snake','snake-head'));
    squares[appleIndex]?.classList.remove('apple');
    clearInterval(timerId);
    snake = [2,1,0];
    direction = 1;
    intervalTime = 300;
    score = 0;
    scoreDisplay.textContent = score;
    generateApple();
    drawSnake();
    timerId = setInterval(move, intervalTime);
}

document.addEventListener('keydown', control);
startBtn.addEventListener('click', startGame);

createGrid();