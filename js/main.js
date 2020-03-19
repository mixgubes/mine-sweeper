'use strict'
//TODO: hint

//TODO: Bonus: keep score (timer) 
//TODO: Bonus: Add support for “LIVES”: 3
//TODO: Bonus: Keep the best score in local storage (per level) and show it on the page 
//TODO: (on win/loss for mines💣)

//TODO: for me: on key down 😖 

var gMineCount = 0;
var gEmptyCellCounter = 0;
var cell_BGC = 'rgb(207, 205, 207)';
var gUserLevelInput = 5;
var gBoard;
var gSetMineNumber = 2;
var gIsWinInFirstClick;
var gIsFirstClick;
var gHintCount;
var gHint;

function init() {
    gHint = false;
    gHintCount = 3;
    gIsFirstClick = true;
    gIsWinInFirstClick = false;
    gMineCount = 0;
    gBoard = creatMat(gUserLevelInput);
    gEmptyCellCounter = 0;
    var elResetButton = document.querySelector('.restart-button');
    elResetButton.innerText = '😊';
    // findMine(gBoard);
    render(gBoard)
}

function creatMat(rowAndColNumber) {

    var res = [];
    for (var i = 0; i < rowAndColNumber; i++) {
        res[i] = [];
        for (var j = 0; j < rowAndColNumber; j++) {
            var cell = creatCell(i, j);
            res[i][j] = cell;
        }
    }
    return res;
}

function creatCell(i, j) {

    var res = {
        isMine: false,
        isCleared: false,
        mineCounter: 0,
        pos: { i: i, j: j },
        isFlag: false
    }
    return res;
}

// the level button onClick function
function setLevel(level) {
    if (level === 1) {
        gUserLevelInput = 4;
        gSetMineNumber = 2;
    } else if (level === 2) {
        gUserLevelInput = 8;
        gSetMineNumber = 10;
    } else if (level === 3) {
        gUserLevelInput = 16;
        gSetMineNumber = 50;
    }
    init()
}

function findMine(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            cell.mineCounter = countMineAround(cell.pos)
        }
    }
}

// the cell button onClick function
function clicked(elCell, i, j) {
    if (!gBoard[i][j].isFlag) {
        if (!gHint) {
            if (gBoard[i][j].isMine) {
                elCell.style.backgroundColor = 'red';
                elCell.innerText = '💥';
                isLost();
            } else {
                if (gIsFirstClick) {
                    gIsFirstClick = false;
                    while (gMineCount < gSetMineNumber) {
                        var iRandom = getRandomInt(0, gBoard.length - 1);
                        var jRandom = getRandomInt(0, gBoard[0].length - 1);
                        if (iRandom !== i && jRandom !== j) {
                            if (gBoard[iRandom][jRandom].isMine !== true) {
                                gBoard[iRandom][jRandom].isMine = true;
                                gMineCount++
                            }
                        }
                    }
                    findMine(gBoard);
                    render(gBoard);
                    elCell.style.backgroundColor = cell_BGC;
                    elCell.innerText = gBoard[i][j].mineCounter;
                    clicked(elCell, i, j)
                } else {

                    if (gBoard[i][j].mineCounter === 0 && gBoard[i][j].isCleared === false) {
                        gBoard[i][j].isCleared = true;
                        gEmptyCellCounter++
                        elCell.innerText = '';
                        elCell.style.backgroundColor = cell_BGC;
                        exposeZeroAround({ i: i, j: j })
                    } else if (gBoard[i][j].isCleared === false) {
                        gBoard[i][j].isCleared = true;
                        gEmptyCellCounter++;
                        elCell.style.backgroundColor = cell_BGC;
                        elCell.innerText = gBoard[i][j].mineCounter;
                        isWin()
                    }
                }
            }
        } else {
            hintPress(elCell, i, j);
        }
    }
}

function countMineAround(pos) {
    var count = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue
            var cell = gBoard[i][j]
            if (pos === cell.pos) continue;
            if (cell.isMine) count++
        }
    }
    return count
}

// find and expose all the zero cells 
function exposeZeroAround(pos) {
    var elCell;
    var nextCellsToClear = [];
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            var cell = gBoard[i][j]
            if (cell.isFlag) continue
            if (pos.i === cell.pos.i && pos.j === cell.pos.j) continue;
            if (cell.isCleared === true) continue;
            if (cell.mineCounter === 0) {
                gEmptyCellCounter++
                elCell = document.querySelector('.cell' + i + '-' + j);
                elCell.innerText = '';
                elCell.style.backgroundColor = cell_BGC;
                cell.isCleared = true;
                nextCellsToClear.push(cell)
            }
            else {
                if (cell.isCleared === true) continue;
                gEmptyCellCounter++
                elCell = document.querySelector('.cell' + i + '-' + j);
                elCell.style.backgroundColor = cell_BGC;
                elCell.innerText = gBoard[i][j].mineCounter;
                gBoard[i][j].isCleared = true;
            }
        }
    }
    for (var i = 0; i < nextCellsToClear.length; i++) {
        exposeZeroAround(nextCellsToClear[i].pos);
    }
    if (gMineCount === (gBoard.length * gBoard[0].length) - gEmptyCellCounter) {
        if (!gIsWinInFirstClick) {
            gIsWinInFirstClick = true;
            isWin();
        }
    }
}

function setFlag(elCell, i, j) {
    if (gBoard[i][j].isCleared) return;
    if (!gBoard[i][j].isFlag) {
        gBoard[i][j].isFlag = true;
        elCell.style.backgroundColor = 'grey';
        elCell.innerText = '🚩'
    } else {
        gBoard[i][j].isFlag = false;
        elCell.style.backgroundColor = 'brown';
        elCell.innerText = ''
    }
}

function isWin() {
    if (gMineCount === (gBoard.length * gBoard[0].length) - gEmptyCellCounter) {
        var elResetButton = document.querySelector('.restart-button');
        elResetButton.innerText = '😎';
        setTimeout(() => {
            return alert('you won!');
        }, 20);
    }
    return
}
function isLost() {
    var elResetButton = document.querySelector('.restart-button');
    elResetButton.innerText = '🥵';
    setTimeout(() => {
        return alert('you lost!');
    }, 20);
}

function hint() {
    var elHint = document.querySelector('.hint-button');
    if (gHintCount > 0) {
        gHint = !gHint;
        if(gHint){
            elHint.style.backgroundColor = 'lightblue';
            elHint.style.color = 'black';
            return
        }else{
            elHint.style.backgroundColor = 'blue';
            elHint.style.color = 'white';
            return
        }
    } else {
        return alert('you don\'t have more hints');
    }
}

function hintPress(elCell, i, j) {
    var iPos = i;
    var jPos = j;

    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue
            var cell = gBoard[i][j]
            if (cell.isCleared) continue;
            if (cell.isMine) {
                elCell = document.querySelector('.cell' + i + '-' + j)
                elCell.style.backgroundColor = cell_BGC;
                elCell.innerText = '💣';
            } else {
                elCell = document.querySelector('.cell' + i + '-' + j)
                elCell.style.backgroundColor = cell_BGC;
                elCell.innerText = gBoard[i][j].mineCounter;
            }
        }
    }
    setTimeout(() => {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++){
                if(!gBoard[i][j].isCleared){
                    elCell = document.querySelector('.cell'+i+'-'+j)
                    elCell.innerText = '';
                    elCell.style.backgroundColor = 'brown';
                }
            }
        }
    }, 1000);
    gHintCount--;
    gHint = !gHint;
    var elHint = document.querySelector('.hint-button');
    elHint.innerText = 'Hint ' + gHintCount;
    elHint.style.backgroundColor = 'blue';
    elHint.style.color = 'white';
    render(gBoard)
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}