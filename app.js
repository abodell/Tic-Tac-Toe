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

const displayController = (() => {

})();