function render(board) {
    if(gIsFirstClick){
    var strHTML = '<table><tbody>';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>';
        for (var j = 0; j < board[0].length; j++) {
            strHTML += `<td oncontextmenu="setFlag(this,${i},${j})" onclick="clicked(this,${i},${j})" class="cell cell${i}-${j}"></td>`;
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>'

    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;

    var elHint = document.querySelector('.hint');
    elHint.innerHTML = `<div onclick="hint()" class="hint-button">Hint x${gHintCount}</div>`
}
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            var elCell = document.querySelector('.cell' + i + '-' + j)

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
    }
}