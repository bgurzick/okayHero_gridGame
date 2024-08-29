const rows = 15;
const columns = 20;
const totalSquares = rows * columns;
const noAccessCount = 7;
const grid = document.getElementById('gameBoard');
const message = document.getElementById('message');
const clockElement = document.getElementById('clock');

let gridArray = Array(rows).fill(null).map(() => Array(columns).fill(null));

let clockSeconds = 0;
let clockInterval = null;
let isClockRunning = true;
let noAccessHovered = new Set();
let hotPinkHovered = false;

// creating and appending squares to the game board
for (let i = 0; i < totalSquares; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    grid.appendChild(square);
    gridArray[Math.floor(i / columns)][i % columns] = square;
}

// a function to pick random indices
function getRandomIndices(count) {
    const indices = [];
    while (indices.length < count) {
        const index = Math.floor(Math.random() * totalSquares);
        if (!indices.includes(index)) {
            indices.push(index);
        }
    }
    return indices;
}

// assign "NO ACCESS" squares (a block-type for the game)
const noAccessIndices = getRandomIndices(noAccessCount);
noAccessIndices.forEach(index => {
    const r = Math.floor(index / columns);
    const c = index % columns;
    gridArray[r][c].classList.add('no-access');
});

// assign "HOT PINK" square (which designates the princess)
const hotPinkIndex = getRandomIndices(1)[0];
const hotPinkRow = Math.floor(hotPinkIndex / columns);
const hotPinkCol = hotPinkIndex % columns;
gridArray[hotPinkRow][hotPinkCol].classList.add('hot-pink');

// function to update the clock
function updateClock() {
    if (clockSeconds < 5) {
        clockSeconds++;
        clockElement.textContent = `:${clockSeconds.toString().padStart(2, '0')}`;
        // trigger game over if the clock reaches 5 seconds
        if (clockSeconds === 5 && isClockRunning) {
            gameOver();
        }
    }
    if (clockSeconds >= 5 || !isClockRunning) {
        clearInterval(clockInterval);
    }
}

// start the clock
clockInterval = setInterval(updateClock, 1000);

// game over function
function gameOver() {
    gridArray.flat().forEach(square => {
        square.style.backgroundColor = 'black';
    });
    message.innerHTML = 'Damn. Evil wins again.';
    const buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = ''; // clear existing content

    const button = document.createElement('button');
    button.textContent = 'Turn Back Time?';
    button.addEventListener('click', () => {
        location.reload(); // reload page
    });
    buttonContainer.appendChild(button);
    isClockRunning = false; // stop the clock
}

// mouse hover events
gridArray.flat().forEach(square => {
    square.addEventListener('mouseover', (event) => {
        const target = event.target;
        if (target.classList.contains('no-access')) {
            target.style.backgroundColor = 'black';
            message.textContent = 'NO ACCESS!';
            noAccessHovered.add(target);
            // check if all NO ACCESS squares are hovered
            if (noAccessHovered.size === noAccessCount && !hotPinkHovered) {
                gameOver();
            }
        } else if (target.classList.contains('hot-pink')) {
            target.style.backgroundColor = 'hotpink';
            message.textContent = 'Okay, hero!';
            hotPinkHovered = true;
            isClockRunning = false;
            updateClock(); // check/update final second
        } else {
            target.style.backgroundColor = 'limegreen';
        }
    });
    square.addEventListener('mouseleave', (event) => {
        const target = event.target;
        if (!target.classList.contains('no-access') && !target.classList.contains('hot-pink')) {
            target.style.backgroundColor = 'limegreen';
        }
    });
});
