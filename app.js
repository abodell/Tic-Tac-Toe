"use strict";

const Player = (marker) => {
    this.marker = marker;
    const getMarker = () => {
        return marker;
    }

    return {getMarker};
};

const gameBoard = (() => {
    const board = [ // array representation of our board
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    // place the marker where the user wants, as long as its in bounds
    const placeMarker = (marker, row, col) => {
        if (row > 3 || col > 3 || row < 0 || col < 0) {
            return;
        }
        board[row][col] = marker;
    };

    const getPosition = (row, col) => {
        if (row > 3 || col > 3 || row < 0 || col < 0) {
            return;
        }
        return board[row][col];
    };

    const clearBoard = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                board[i][j] = '';
            }
        }
    };

    return {placeMarker, getPosition, clearBoard};

})();

const gameController = (() => {
    const player1 = Player('X', "");
    const player2 = Player('O', "");
    const numToWin = 3;

    let isWinner = false;
    let isXTurn = true;
    let isTie = false;


    const checkHorizWin = (row, col, marker) => {
        // need to traverse left and right to see how many in a row
        // first we will traverse right
        let consecutiveCount = 1;
        for (let i = col + 1; i < numToWin; i++) {
            if (gameBoard.getPosition(row, i) === marker) {
                consecutiveCount++;
                if (consecutiveCount === numToWin) {
                    isWinner = true;
                    return isWinner;
                }
            }
        }
        // now, traverse left
        for (let i = col - 1; i >= 0; i--) {
            if (gameBoard.getPosition(row, i) === marker) {
                consecutiveCount++;
                if (consecutiveCount === numToWin) {
                    isWinner = true;
                    return isWinner;
                }
            }
        }
        return isWinner;
    };

    const checkVertWin = (row, col, marker) => {
        let consecutiveCount = 1;
        // traverse up
        for (let i = row + 1; i < numToWin; i++) {
            if (gameBoard.getPosition(i, col) === marker) {
                consecutiveCount++;
                if (consecutiveCount === numToWin) {
                    isWinner = true;
                    return isWinner;
                }
            }
        }
        //traverse down
        for (let i = row - 1; i >= 0; i--) {
            if (gameBoard.getPosition(i, col) === marker) {
                consecutiveCount++;
                if (consecutiveCount === numToWin) {
                    isWinner = true;
                    return isWinner;
                }
            }
        }
        return isWinner;
    };

    const checkDiagWin = (row, col, marker) => {
        let consecutiveCount = 1;
        // traverse up and to the right, then down and to the left
        // up and to the right
        for (let i = row + 1, j = col + 1; i < numToWin && j < numToWin; i++, j++) {
            if (gameBoard.getPosition(i, j) === marker) {
                consecutiveCount++;
                if (consecutiveCount === numToWin) {
                    isWinner = true;
                    return isWinner;
                }
            }
        }
        // down and to the left
        for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
            if (gameBoard.getPosition(i, j) === marker) {
                consecutiveCount++;
                if (consecutiveCount === numToWin) {
                    isWinner = true;
                    return isWinner;
                }
            }
        }

        // reset consecutiveCount before going across the other diagonal
        consecutiveCount = 1;
        // down and to the right
        for (let i = row - 1, j = col + 1; i >= 0 && j < numToWin; i--, j++) {
            if (gameBoard.getPosition(i, j) === marker) {
                consecutiveCount++;
                if (consecutiveCount === numToWin) {
                    isWinner = true;
                    return isWinner;
                }
            }
        }

        // up and to the left
        for (let i = row + 1, j = col - 1; i < numToWin && j >= 0; i++, j--) {
            if (gameBoard.getPosition(i, j) === marker) {
                consecutiveCount++;
                if (consecutiveCount === numToWin) {
                    isWinner = true;
                    return isWinner;
                }
            }
        }
        return isWinner;
    };

    const checkForWin = (row, col, marker) => {
        return (checkHorizWin(row, col, marker) || checkVertWin(row, col, marker) || checkDiagWin(row, col, marker));
    };

    // need to check for ties
    const checkTie = () => {
        for (let i = 0; i < numToWin; i++) {
            for (let j = 0; j < numToWin; j++) {
                if (gameBoard.getPosition(i,j) === '') {
                    return false;
                }
            }
        }
        if (isWinner === true) {
            return false;
        }
        isTie = true;
        return isTie;
    };

    const restartGame = () => {
        isWinner = false;
        isXTurn = true;
        isTie = false;
        gameBoard.clearBoard();
        displayController.changeMessage("Player " + player1.getMarker() + " it is your turn");
    }

    // logic for the gameplay
    const playerAction = (row, col) => {
        if (isXTurn) {
            gameBoard.placeMarker(player1.getMarker(), row, col);
            if (checkForWin(row, col, player1.getMarker())) {
                displayController.changeMessage("Player " + player1.getMarker() + " has won the game!");
                return;
            }

            if (checkTie()) {
                displayController.changeMessage('Game Ended in a Tie!');
                return;
            }

            isXTurn = !isXTurn;
            displayController.changeMessage("Player " + player2.getMarker() + " it is your turn");
            
        } else {
            gameBoard.placeMarker(player2.getMarker(), row, col);
            if (checkForWin(row, col, player2.getMarker())) {
                displayController.changeMessage("Player " + player2.getMarker() + " has won the game!");
                return;
            }

            if (checkTie()) {
                displayController.changeMessage("Game Ended in a Tie!");
                return;
            }
            isXTurn = !isXTurn;
            displayController.changeMessage("Player " + player1.getMarker() + " it is your turn");
        }
    };

    const getIsWinner = () => {
        return isWinner;
    }

    return {playerAction, checkForWin, restartGame, getIsWinner};

})();

// create the display controller to update the elements on the screen
const displayController = (() => {
    const spaces = document.querySelectorAll('.space');
    const message = document.querySelector('.message');
    const restartBtn = document.querySelector('#restart');
    const startBtn = document.querySelector("#startbtn")
    const mode = document.querySelector('#mode');
    // buttons for the different game modes
    const impossible = document.querySelector("#impossible");
    const friend = document.querySelector("#friend");
    let isStart = false;
    let gameSelected = false;
    let gameMode;

    impossible.addEventListener('click', () => {
        mode.textContent = 'Game Mode: Impossible';
        gameSelected = true;
        gameMode = 'impossible';
    });

    friend.addEventListener('click', () => {
        mode.textContent = 'Game Mode: Versus a Friend';
        gameMode = 'Versus a friend';
        gameSelected = true;
    });


    startBtn.addEventListener('click', () => {
        isStart = true;
        startBtn.textContent = 'Game In Progress';
    });

    restartBtn.addEventListener('click', () => {
        isStart = false;
        gameSelected = false;
        startBtn.textContent = 'Click Here to Start';
        mode.textContent = "Select a Game Mode";
        gameController.restartGame();
        populateDisplay();
    });

    spaces.forEach((space) => {
        space.addEventListener('click', (event) => {
            // if the game is over or the space is already occupied, we don't want to allow a click
            if (gameController.getIsWinner() || !isStart || event.target.textContent !== '' || !gameSelected) {
                return;
            } else {
                gameController.playerAction(parseInt(event.target.dataset.row), parseInt(event.target.dataset.col));
                populateDisplay();
            }
        })
    });

    const populateDisplay = () => {
        for (let i = 0; i < spaces.length; i++) {
            spaces[i].textContent = gameBoard.getPosition(parseInt(spaces[i].dataset.row), parseInt(spaces[i].dataset.col));
        }
    };

    const changeMessage = (string) => {
        message.textContent = string;
    };

    return {changeMessage};

})();