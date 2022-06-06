"use strict";

const Player = (marker, name) => {
    this.marker = marker;
    this.name = name;

    const getMarker = () => {
        return this.marker;
    }

    const getName = () => {
        return this.name;
    }

    return {getMarker, getName};
};


const gameBoard = (() => {
    const board = [ // array representation of our board
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    // place the marker where the user wants, as long as its in bounds
    const placeMarker = (marker, row, col) => {
        if (row > 3 || col > 3 || row < 1 || col < 1) {
            return;
        }
        board[row][col] = marker;
    };

    const getPosition = (row, col) => {
        if (row > 3 || col > 3 || row < 1 || col < 1) {
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
    const player1 = new Player('X');
    const player2 = new Player('O');
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
        consecutiveCount = 0;
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
    }

    const switchTurns = () => {
        // switch the message on the screen to the other player
        if (isXTurn) {
            isXTurn = false;
        } else {
            isXTurn = true;
        }
    };

    // logic for the gameplay
    const playerAction = (row, col) => {
        if (isXTurn) {
            gameBoard.placeMarker(player1.getMarker(), row, col);
            if (checkForWin(row, col, player1.getMarker())) {
                // update the message on the screen
                return;
            }

            if (checkTie()) {
                // update the message on the screen
                return;
            }

            switchTurns();
            
        } else {
            gameBoard.placeMarker(player2.getMarker(), row, col);
            if (checkForWin(row, col, player2.getMarker())) {
                // update the message on the screen
                return;
            }

            if (checkTie()) {
                // update the message on the screen
                return;
            }
            switchTurns();
        }

    };

    {return playerAction, checkForWin, restartGame};

})();

// create the display controller to update the elements on the screen
const displayController = (() => {
    const spaces = document.querySelectorAll('.space');
    const message = document.querySelector('.message');
    
})();