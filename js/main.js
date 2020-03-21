'use strict'
//TODO: revile the board when win/loss  

//TODO: Bonus: Keep the best score in local storage (per level) and show it on the page 
//TODO: Bonus: Manually positioned mines: positions the mines (by clicking cells) and then plays.
//TODO: Bonus: add an “UNDO” button, each click on that button takes the game back 1 step

//TODO: for me: on key down 😖 

var gBoard;
var gNumberOfChances;
var gLandOnMineCounter;
var gIsFirstClick;
var gEmptyCellCounter;
var gInterClock;
var gBoards;

var gLevel = {
    size: 4,
    mines: 2
};

var gTime = {
    sec: 0,
    tenSec: 0,
    min: 0,
    tenMin: 0,
    isCalled: false
};

var gGame = {
    isOn: true,
    secsPassed: 0
}

var gIsHintActive;
var gHintCount;
var gSafeCount;
var gMineBlownCount;

function init() {
    clearInterval(gInterClock);
    var startValue = 0;
    gGame.isOn = true;
    gBoards = [];
    gEmptyCellCounter = startValue;
    gTime.sec = startValue;
    gTime.tenSec = startValue;
    gTime.min = startValue;
    gTime.tenMin = startValue;
    gTime.isCalled = false
    gNumberOfChances = 3;
    gLandOnMineCounter = startValue;
    gIsFirstClick = true;
    gIsHintActive = false;
    gHintCount = 3;
    gSafeCount = 3;
    gMineBlownCount = startValue;
    renderClock();
    gBoard = createMat(gLevel.size, createCell);
    renderMineLeftCount()

    render(gBoard);
}

function createMat(numberOfAndCols, cell) {
    var mat = [];

    for (var i = 0; i < numberOfAndCols; i++) {
        mat[i] = [];
        for (var j = 0; j < numberOfAndCols; j++) {
            mat[i][j] = cell(i, j);
        }
    }
    return mat;
}

function createCell(i, j) {
    var cell = {
        isMine: false,
        isCleared: false,
        mineCounter: 0,
        pos: { i: i, j: j },
        isFlag: false,
        isClicked: false
    }
    return cell;
}

function clicked(i, j) {
    renderMineLeftCount()
    if (!gGame.isOn) return
    if (!gBoard[i][j].isFlag) {
        if (!gIsHintActive) {
            var cell = gBoard[i][j];
            cell.isClicked = true;
            if (gIsFirstClick) {
                gIsFirstClick = false
                gEmptyCellCounter = countInMat('isCleared');
                var numberOfMines = countInMat('isMine');
                while (numberOfMines < gLevel.mines) {
                    var iRandom = getRandomInt(0, gBoard.length - 1);
                    var jRandom = getRandomInt(0, gBoard[0].length - 1);
                    if (iRandom !== i && jRandom !== j) {
                        if (!gBoard[iRandom][jRandom].isMine) {
                            gBoard[iRandom][jRandom].isMine = true;
                        }
                    }
                    numberOfMines = countInMat('isMine');
                }
                findMine();
                renderMat();
                clicked(i, j)
                gEmptyCellCounter = countInMat('isCleared');
                if (gEmptyCellCounter === (gBoard.length * gBoard[0].length) - gLevel.mines) win(true);
                if (!gTime.isCalled) {
                    gTime.isCalled = true;
                    clock();
                }
            } else {
                if (cell.isMine) {
                    isDead();
                }
                copyBoard();
                if (cell.mineCounter === 0 && !cell.isCleared && !cell.isMine) {
                    cell.isCleared = true;
                    exposeZeroAround({ i: i, j: j });
                } else if (!gBoard[i][j].isCleared) {
                    cell.isCleared = true;
                }
                gEmptyCellCounter = countInMat('isCleared');
                if (gEmptyCellCounter === (gBoard.length * gBoard[0].length) - gLevel.mines) win(true);
                renderMat();
            }
        } else {
            hintPress(i, j);
        }
    }
}

function isDead() {
    if (gNumberOfChances - 1 > gLandOnMineCounter) {
        gLandOnMineCounter++;
        renderMat();
        renderLife()
    } else {
        win(false);
    }
}

function win(isWin) {
    var message;

    gGame.isOn = false;
    clearInterval(gInterClock);
    if (isWin) {
        message = 'You Won!';
    } else {
        var elLife = document.querySelector('.life-icon');
        elLife.innerText = '';
        message = 'You Lost!';
    }
    setTimeout(() => {
        revileMat(isWin)
    }, 50);
    setTimeout(() => {
        alert(message);
    }, 70);
}

function setLevel(level) {

    if (level === 1) {
        gLevel.size = 4;
        gLevel.mines = 2;
    } else if (level === 2) {
        gLevel.size = 8;
        gLevel.mines = 10;
    } else if (level === 3) {
        gLevel.size = 16;
        gLevel.mines = 50;
    }
    init()
}

function countInMat(getNumberOfDataAsSrt) {
    var count = 0
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (findValueInObject(i, j, getNumberOfDataAsSrt)) count++;
        }
    }
    return count;
}

function findValueInObject(i, j, isData) {
    var res = gBoard[i][j][isData];
    return res;
}

function findMine() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            cell.mineCounter = countMineAround(cell.pos);
        }
    }
}

function countMineAround(pos) {
    var count = 0;
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue;
            var cell = gBoard[i][j];
            if (pos === cell.pos) continue;
            if (cell.isMine) count++;
        }
    }
    return count;
}

function clock() {
    var timeStampA = Date.now();
    var timeStampB = Date.now();

    gInterClock = setInterval(() => {
        if (timeStampB > timeStampA + 1000) {
            gTime.sec++;
            timeStampA = timeStampB;
        }
        if (gTime.sec > 9) {
            gTime.sec = 0;
            gTime.tenSec++;
        }
        if (gTime.tenSec > 5) {
            gTime.tenSec = 0;
            gTime.min++;
        }
        if (gTime.min > 9) {
            gTime.min = 0;
            gTime.tenMin++;
        }
        renderClock()
        timeStampB = Date.now();
    }, 25);
}

function setFlag(i, j) {
    if (!gGame.isOn) return
    if (!gTime.isCalled) {
        gTime.isCalled = true;
        clock();
    }
    if (gBoard[i][j].isCleared) return;
    if (!gBoard[i][j].isFlag) {
        gBoard[i][j].isFlag = true;
    } else {
        gBoard[i][j].isFlag = false;
    }
    renderMat()
    renderMineLeftCount()
    return
}

function hint() {
    if (!gGame.isOn) return
    if (gHintCount > 0) {
        gIsHintActive = !gIsHintActive;
        renderHint();
    } else {
        return alert('You don\'t have any hints left');
    }
}

function undo() {
    gBoard = gBoards.pop();
    renderMat();
}

function copyBoard() {
    var copiedBoard = [];

    for (var i = 0; i < gBoard.length; i++) {
        copiedBoard[i] = [];
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = {
                pos:{}
            }
            copiedBoard[i][j] = cell;
            copiedBoard[i][j].isMine = gBoard[i][j].isMine;
            copiedBoard[i][j].isCleared = gBoard[i][j].isCleared;
            copiedBoard[i][j].mineCounter = gBoard[i][j].mineCounter;
            copiedBoard[i][j].pos.i = gBoard[i][j].pos.i;
            copiedBoard[i][j].pos.j = gBoard[i][j].pos.j;
            copiedBoard[i][j].isFlag = gBoard[i][j].isFlag;
            copiedBoard[i][j].isClicked = gBoard[i][j].isClicked;
        }
    }
    gBoards.push(copiedBoard);
}

function exposeZeroAround(pos) {
    var nextCellsToClear = [];

    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue;
            var cell = gBoard[i][j];
            if (cell.isFlag) continue;
            if (pos.i === cell.pos.i && pos.j === cell.pos.j) continue;
            if (cell.isCleared) continue;
            if (cell.isMine) continue;
            if (cell.mineCounter === 0) {
                cell.isCleared = true;
                nextCellsToClear.push(cell)
            } else {
                if (cell.isCleared === true) continue;
                gBoard[i][j].isCleared = true;
            }
        }
    }
    for (var i = 0; i < nextCellsToClear.length; i++) {
        exposeZeroAround(nextCellsToClear[i].pos);
    }
    if (gEmptyCellCounter === (gBoard.length * gBoard[0].length) - gLevel.mines) win(true);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function custom(){
    
}