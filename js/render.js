'use strict'
const gFLAG_ICON = '🚩';
const gMINE_ICON = '💣';
const gLOSS_ICON = '🥵';
const gWIN_ICON = '😎';
const gMAIN_ICON = '😊';
// const SCARED_ICON = '😖';
const gEXPLOSION_ICON = '💥';
const gSTAR_ICON = '⭐';
const gLIFE_ICON = '💖';
const SETTINGS = '⚙️'
const gCellBackground = 'rgb(207, 205, 207)';

function render(board) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td oncontextmenu="setFlag(${i},${j})" 
            onclick="clicked(${i},${j})" class="cell cell${i}-${j}"></td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>'

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;

    var elRestartButton = document.querySelector('.restart-button');
    elRestartButton.innerText = gMAIN_ICON;

    var elHint = document.querySelector('.hint');
    elHint.innerHTML = `<div onclick="undo()" class="undo">UNDO</div>
    <div onclick="hint()" class="hint-button">Hint x${gHintCount}</div>
    <div onclick="custom()" class="custom">${SETTINGS}</div>`

    var elSafe = document.querySelector('.safe-number');
    elSafe.innerText = `X ${gSafeCount}`

    var elLife = document.querySelector('.life-icon');
    elLife.innerText = gLIFE_ICON + gLIFE_ICON + gLIFE_ICON;
}
function renderMat() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            var elCell = document.querySelector('.cell' + i + '-' + j);

            if (cell.isCleared) {
                if (!cell.isMine) {
                    elCell.style.backgroundColor = gCellBackground;
                    elCell.innerText = cell.mineCounter;

                    if (cell.mineCounter === 0) elCell.innerText = '';
                    if (gBoard[i][j].mineCounter === 1) {
                        elCell.style.color = 'blue';
                    } else if (gBoard[i][j].mineCounter === 2) {
                        elCell.style.color = 'green';
                    } else if (gBoard[i][j].mineCounter === 3) {
                        elCell.style.color = 'red';
                    } else if (gBoard[i][j].mineCounter === 4) {
                        elCell.style.color = 'rgb(1, 1, 46)';
                    } else if (gBoard[i][j].mineCounter === 5) {
                        elCell.style.color = 'rgb(46, 1, 1)';
                    } else if (gBoard[i][j].mineCounter === 6) {
                        elCell.style.color = 'rgb(199, 1, 139)';
                    } else {
                        elCell.style.color = 'rgb(85, 13, 63)'
                    }
                }
            } else if (cell.isMine && cell.isClicked) {
                elCell.style.backgroundColor = 'red';
                elCell.innerText = gEXPLOSION_ICON;
            } else {
                elCell.style.backgroundColor = 'brown';
                elCell.innerText = '';
            }
            if (cell.isFlag) {
                elCell.style.backgroundColor = 'grey';
                elCell.innerText = gFLAG_ICON;
            }
        }
    }
}

function renderClock() {
    var elTime = document.querySelector('.time');
    elTime.innerText = gTime.tenMin + '' + gTime.min + ':' + gTime.tenSec + '' + gTime.sec
}

function revileMat(isWin) {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]; 
            if (isWin) {
                var elRestartButton = document.querySelector('.restart-button');
                elRestartButton.innerText = gWIN_ICON;
                var elCell = document.querySelector('.cell' + i + '-' + j);
                elCell.style.backgroundColor = gCellBackground;
                if (cell.isMine) elCell.innerText = gFLAG_ICON;
            } else if (!isWin) {
                var elRestartButton = document.querySelector('.restart-button');
                elRestartButton.innerText = gLOSS_ICON;
                var elCell = document.querySelector('.cell' + i + '-' + j);
                elCell.style.backgroundColor = gCellBackground;
                if (cell.isMine) {
                    elCell.innerText = gMINE_ICON;
                } else {
                    elCell.innerText = cell.mineCounter;
                    if (cell.mineCounter === 0) elCell.innerText = '';
                }
            }
        }
    }
}

function renderHint() {
    var elHint = document.querySelector('.hint-button');
    if (gIsHintActive) {
        elHint.style.backgroundColor = 'lightblue';
        elHint.style.color = 'black';
        return
    } else {
        elHint.style.backgroundColor = 'rgb(11, 11, 102)';
        elHint.style.color = 'white';
        return
    }
}

function hintPress(i, j) {
    var iPos = i;
    var jPos = j;
    var elCell = document.querySelector('.cell' + i + '-' + j)

    for (var i = iPos - 1; i <= iPos + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = jPos - 1; j <= jPos + 1; j++) {
            if (j < 0 || j >= gBoard.length) continue
            var cell = gBoard[i][j]
            if (cell.isCleared) continue;
            if (cell.isMine) {
                elCell = document.querySelector('.cell' + i + '-' + j)
                elCell.style.backgroundColor = gCellBackground;
                elCell.innerText = gMINE_ICON;
            } else {
                elCell = document.querySelector('.cell' + i + '-' + j)
                elCell.style.backgroundColor = gCellBackground;
                elCell.innerText = gBoard[i][j].mineCounter;
                if (cell.mineCounter === 0) elCell.innerText = '';
            }
        }
    }
    setTimeout(() => {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard[0].length; j++) {
                if (gBoard[i][j].isFlag === true) {
                    elCell = document.querySelector('.cell' + i + '-' + j)
                    elCell.innerText = gFLAG_ICON;
                    elCell.style.backgroundColor = 'grey';
                } else if (!gBoard[i][j].isCleared) {
                    elCell = document.querySelector('.cell' + i + '-' + j)
                    elCell.innerText = '';
                    elCell.style.backgroundColor = 'brown';
                }
            }
        }
    }, 1000);
    if (!gIsFirstClick) gHintCount--;
    gIsHintActive = !gIsHintActive;
    var elHint = document.querySelector('.hint-button');
    elHint.innerText = 'Hint ' + gHintCount;
    elHint.style.backgroundColor = 'rgb(11, 11, 102)';
    elHint.style.color = 'white';
}

function safeCell() {
    if (gGame.isOn) {
        if (gSafeCount < 1) return alert('You don\'t have any safe clicks left')
        var iRandom = getRandomInt(0, gBoard.length);
        var jRandom = getRandomInt(0, gBoard[0].length);
        var mineCount = countInMat('isMine');

        if((gBoard.length * gBoard[0].length) - gEmptyCellCounter - mineCount === 0)return;
        
        if (gEmptyCellCounter > 0) {
            while (gBoard[iRandom][jRandom].isCleared || gBoard[iRandom][jRandom].isMine) {
                iRandom = getRandomInt(0, gBoard.length);
                jRandom = getRandomInt(0, gBoard[0].length);
            }
            var elCell = document.querySelector('.cell' + iRandom + '-' + jRandom);
            gSafeCount--;
            var elSafe = document.querySelector('.safe-number');
            elSafe.innerText = `X ${gSafeCount}`
            setTimeout(() => {
                if (elCell.innerText === gSTAR_ICON) {
                    elCell.innerText = '';
                    elCell.style.backgroundColor = 'brown';
                    return;
                }
            }, 2000);
            elCell.style.backgroundColor = 'green';
            elCell.innerText = gSTAR_ICON;
        }
    }
    return
}

function renderLife(){
    var elLife = document.querySelector('.life-icon');
    
    elLife.innerText = '';
    for (var i = 0; i < (gNumberOfChances - gLandOnMineCounter); i++) {
        elLife.innerText += gLIFE_ICON;
    }
    return;
}

function renderMineLeftCount(){
    var elMineLeft = document.querySelector('.mine-number');
    elMineLeft.innerText = countInMat('isMine') - countInMat('isFlag');
}