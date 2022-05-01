alert("This game is Designed for Desktops.So, sorry if you are playing on mobile phone you will be unable to play")
alert("----------How to play?----------\nUp Arrow - Rotate piece\nDown Arrow - increase down speed of Piece\nLeft Arrow - move left\nAnd, Right Arrow - move Right\n\n                    Enjoy Playing!!")

document.addEventListener('DOMContentLoaded', () => {
    const width = 10;
    const grid = document.querySelector("#mainGrid");
    let box = Array.from(document.querySelectorAll("#mainGrid div"));
    const scoreDisplay = document.querySelector("#score");
    const startBtn = document.querySelector("#startButton");
    const newGameBtn = document.querySelector("#newGameButton");
    let nextRandom = 0;
    let timerID;
    let currentPosition = 5;
    let score = 0;
    const colors = [
        'orangered',
        'brown',
        'coral',
        'cyan',
        'greenyellow'
    ]
    // The Pieces
    const lPiece = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];

    const zPiece = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tPiece = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oPiece = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iPiece = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const pieces = [lPiece, zPiece, tPiece, oPiece, iPiece];

    var randomPiece = Math.floor(Math.random() * pieces.length);
    var randomRotation = Math.floor(Math.random() * pieces[0].length);
    console.log(randomPiece);
    console.log(randomRotation);

    // Picking random piece with random rotation from pieces array
    var currentPiece = pieces[randomPiece][randomRotation];

    // Move piece down every 0.5 second
    // timerID = setInterval(moveDown, 500);
    function draw() {
        currentPiece.forEach(index => {
            box[currentPosition + index].classList.add("piece");
            box[currentPosition + index].style.backgroundColor = colors[randomPiece]
        })
    }
    function undraw() {
        currentPiece.forEach(index => {
            box[currentPosition + index].classList.remove("piece");
            box[currentPosition + index].style.backgroundColor = ''
        })
    }
    function moveDown() {
        undraw();
        currentPosition += width;
        draw();
        freeze();
    }

    function freeze() {
        if (currentPiece.some(index => box[currentPosition + index + width].classList.contains("taken"))) {
            currentPiece.forEach(index => box[currentPosition + index].classList.add("taken"));
            // Start new piece falling
            randomPiece = nextRandom;
            nextRandom = Math.floor(Math.random() * pieces.length);
            randomRotation = Math.floor(Math.random() * pieces[0].length);
            currentPosition = 4;
            currentPiece = pieces[randomPiece][randomRotation];
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }

    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        } else if (e.keyCode === 38) {
            rotate()
        }
    }
    document.addEventListener('keyup', control);

    function moveLeft() {
        undraw();
        const isAtLeft = currentPiece.some(index => (currentPosition + index) % 10 === 0);
        if (!isAtLeft) currentPosition -= 1

        if (currentPiece.some(index => box[currentPosition + index].classList.contains("taken"))) {
            currentPosition += 1
        }
        draw();
    }
    function moveRight() {
        undraw();
        const isAtRight = currentPiece.some(index => (currentPosition + index) % width === width - 1);
        if (!isAtRight) currentPosition += 1

        if (currentPiece.some(index => box[currentPosition + index].classList.contains("taken"))) {
            currentPosition -= 1
        }
        draw();
    }
    function rotate() {
        console.log("Rotation: " + randomRotation);
        undraw();
        console.log("Before: " + randomRotation);
        if (randomRotation === currentPiece.length - 1) {
            randomRotation = 0
        } else {
            randomRotation++;
        }
        currentPiece = pieces[randomPiece][randomRotation];
        draw();
    }

    //show up-next tetromino in mini-grid display
    const displayGrid = Array.from(document.querySelectorAll('#miniGrid div'))
    const displayWidth = 4
    const displayIndex = 0


    //the Tetrominos without rotations
    const upNextPiece = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]
    //display the shape in the mini-grid display
    function displayShape() {
        //remove any trace of a tetromino form the entire grid
        displayGrid.forEach(square => {
            square.classList.remove('piece')
            square.style.backgroundColor = ''
        })
        let nextPiece = upNextPiece[nextRandom];
        // console.log("Next Random: " + nextRandom)
        // console.log(nextPiece)
        // console.log(displayGrid);
        nextPiece.forEach(index => {
            displayGrid[displayIndex + index].classList.add('piece')
            displayGrid[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
    }

    startBtn.addEventListener('click', () => {
        if (timerID) {
            clearInterval(timerID);
            timerID = null;
        } else {
            draw();
            // Move piece down every 0.5 second
            timerID = setInterval(moveDown, 500);
            nextRandom = Math.floor(Math.random() * pieces.length);
            displayShape();
        }
    })

    newGameBtn.addEventListener('click', () => {
        score = 0;
        scoreDisplay.innerHTML = score;
        for (let i = 0; i < 200; i++) {
            box[i].classList.remove('piece');
            box[i].classList.remove('taken');
            box[i].style.backgroundColor = '';
            document.getElementById("gameOver").classList.add('hide');

        }
        document.addEventListener('keyup', control);
        undraw();
        randomPiece = nextRandom;
        nextRandom = Math.floor(Math.random() * pieces.length);
        randomRotation = Math.floor(Math.random() * pieces[0].length);
        currentPosition = 4;
        currentPiece = pieces[randomPiece][randomRotation];
        draw();
        // Move piece down every 0.5 second
        timerID = setInterval(moveDown, 500);
        nextRandom = Math.floor(Math.random() * pieces.length);
        displayShape();

    })

    // Add score and remove pieces one when line is filled 
    function addScore() {
        for (let i = 0; i < 200; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(index => box[index].classList.contains('taken'))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    box[index].classList.remove('taken');
                    box[index].classList.remove('piece');
                    box[index].style.backgroundColor = ''
                })
                const boxRemoved = box.splice(i, width);
                box = boxRemoved.concat(box);
                box.forEach(cell => grid.appendChild(cell));
            }
        }
    }


    function gameOver() {
        if (currentPiece.some(index => box[currentPosition + index].classList.contains('taken'))) {
            document.getElementById("gameOver").classList.remove('hide');
            clearInterval(timerID);
            document.removeEventListener('keyup', control)
        }
    }
})