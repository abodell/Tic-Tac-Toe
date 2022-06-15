"use strict";

const scores = {
    'X': 10,
    'O': -10,
    'tie': 0,
};

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

    const getBoard = () => {
        return board;
    };

    return {placeMarker, getPosition, clearBoard, getBoard};

})();

const gameController = (() => {
    const player1 = Player('X'); // this will be the human player
    const player2 = Player('O'); // this will be the ai
    const numToWin = 3;

    let isWinner = false;
    let isXTurn = true;
    let isTie = false;
    let winningMarker;

    const setWinningMarker = (marker) => {
        winningMarker = marker;
    };

    const getWinningMarker = () => {
        return winningMarker;
    }

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
        if ((checkHorizWin(row, col, marker) || checkVertWin(row, col, marker) || checkDiagWin(row, col, marker))) {
            setWinningMarker(marker);
            return true;
        }
        return false;
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
        setWinningMarker('tie');
        return isTie;
    };

    const restartGame = () => {
        isWinner = false;
        isXTurn = true;
        isTie = false;
        gameBoard.clearBoard();
        displayController.changeMessage("Player " + player1.getMarker() + " it is your turn");
    };

    const bestMove = () => {
        let bestScore = -Infinity;
        let aiMove;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoard.getPosition(i, j) == '') {
                    gameBoard.placeMarker(player2.getMarker(), i, j);
                    let score = minimax(gameBoard.getBoard(), 0, false);
                    gameBoard.placeMarker('', i, j);
                    if (score > bestScore) {
                        bestScore = score;
                        aiMove = {i, j};
                    }
                }
            }
        }
        return aiMove;
    };

    const minimax = (board, depth, isMaximizing) => {
        let result = getWinningMarker();
        if (result != null) {
            return scores[result];
        }
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (gameBoard.getPosition(i, j) == '') {
                        gameBoard.placeMarker(player2.getMarker(), i, j);
                        checkForWin(i, j, player2.getMarker())
                        let score = minimax(board, depth + 1, false);
                        gameBoard.placeMarker('', i, j);
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            setIsWinner(false);
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (gameBoard.getPosition(i, j) == '') {
                        gameBoard.placeMarker(player1.getMarker(), i, j);
                        checkForWin(i, j, player1.getMarker());
                        let score = minimax(board, depth + 1, true);
                        gameBoard.placeMarker('', i, j);
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            setIsWinner(false);
            return bestScore;
        }
    };

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
            let move = bestMove();
            gameBoard.placeMarker(player2.getMarker(), move.i, move.j);
            if (checkForWin(move.i, move.j, player2.getMarker())) {
                displayController.changeMessage("The AI has won the game!");
                return;
            }
            //displayController.changeMessage("Player " + player2.getMarker() + " it is your turn");
            
        } /*else {
            let choice = bestMove();
            console.log(choice);
            gameBoard.placeMarker(player2.getMarker(), choice.i, choice.j);
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
        }*/
    };

    const getIsWinner = () => {
        return isWinner;
    }

    const setIsWinner = (string) => {
        isWinner = string;
    };

    const getIsXTurn = () => {
        return isXTurn;
    }

    return {playerAction, checkForWin, restartGame, getIsWinner, getIsXTurn, bestMove};

})();

// create the display controller to update the elements on the screen
const displayController = (() => {
    const spaces = document.querySelectorAll('.space');
    const message = document.querySelector('.message');
    const restartBtn = document.querySelector('#restart');

    restartBtn.addEventListener('click', () => {
        gameController.restartGame();
        populateDisplay();
    });

    spaces.forEach((space) => {
        space.addEventListener('click', (event) => {
            // if the game is over or the space is already occupied, we don't want to allow a click
            console.log(gameController.getIsWinner());
            console.log(event.target.textContent);
            if (gameController.getIsWinner() || event.target.textContent !== '') {
                return;
            } else if (gameController.getIsXTurn()) {
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
