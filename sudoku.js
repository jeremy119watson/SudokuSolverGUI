/**
 * make a copy of a board (2d array)
 *
 * @param {number[][]} board
 * @return {number[][]}
 */
function copyBoard(board) {
  return board.map(arr => {
    return arr.slice();
  });
}

//starting board
var baseBoard = [
  [7, 0, 0, 0, 0, 1, 4, 0, 5],
  [1, 0, 0, 0, 7, 0, 0, 0, 0],
  [0, 0, 0, 4, 9, 0, 0, 7, 1],
  [4, 0, 0, 0, 5, 0, 0, 0, 0],
  [0, 5, 0, 7, 0, 4, 0, 6, 0],
  [0, 0, 0, 0, 2, 0, 0, 0, 9],
  [3, 7, 0, 0, 4, 5, 0, 0, 0],
  [0, 0, 0, 0, 8, 0, 0, 0, 3],
  [8, 0, 2, 9, 0, 0, 0, 0, 4]
];

var userBoard = copyBoard(baseBoard);
var workingBoard = []; // board used by algorithm to solve
var solvedBoard = [];

/**
 * attempt to solve the userBoard
 * 
 * @return {boolean}
 */
function solve() {
  let emptyRow = -1;
  let emptyCol = -1;

  if (!isBoardValid(userBoard)) {
    return false;
  }

  workingBoard = copyBoard(userBoard);

  // find first empty box
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (workingBoard[row][col] == 0) {
        emptyRow = row;
        emptyCol = col;
        break;
      }
    }
    if (emptyRow > -1) {
      break;
    }
  }

  // exit if now empty square found
  if (emptyRow == -1) {
    return verifySolution(workingBoard);
  }

  let isSolved = backtrackSolve(emptyRow, emptyCol);
  if (isSolved) {
    isSolved = verifySolution(workingBoard);
  }

  if (isSolved) {
    solvedBoard = copyBoard(workingBoard);
    return true;
  }

  return false;
}

/**
 * recursively solve sudoku board
 * 
 * @param {number} curRow 
 * @param {number} curCol 
 * @return {boolean}
 */
function backtrackSolve(curRow, curCol) {
  for (let i = 1; i < 10; i++) {
    // if number works in this state, recursivily check next box
    if (
      checkCol(curRow, curCol, i) &&
      checkRow(curRow, curCol, i) &&
      checkSquare(curRow, curCol, i)
    ) {
      // number works
      workingBoard[curRow][curCol] = i;

      // find next empty box
      let nextRow = curRow;
      let nextCol = curCol;
      while (workingBoard[nextRow][nextCol] != 0) {
        if (nextCol == 8) {
          if (nextRow == 8) {
            return true;
          }
          nextCol = 0;
          nextRow++;
        } else {
          nextCol++;
        }
      }

      if (backtrackSolve(nextRow, nextCol) == true) {
        return true;
      }
    }
  }
  workingBoard[curRow][curCol] = 0;

  return false;
}

/**
 * check if num is already in the current square
 * 
 * @param {number} curRow 
 * @param {number} curCol 
 * @param {number} num 
 * @return {boolean}
 */
function checkSquare(curRow, curCol, num) {
  let quadRow = getSquareCoordinates(curRow);
  let quadCol = getSquareCoordinates(curCol);
  for (let row = quadRow; row < quadRow + 3; row++) {
    for (let col = quadCol; col < quadCol + 3; col++) {
      if (num == workingBoard[row][col]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * check if num is in current column
 * 
 * @param {number} curRow 
 * @param {number} curCol 
 * @param {number} num 
 * @return {boolean}
 */
function checkCol(curRow, curCol, num) {
  for (let row = 0; row < 9; row++) {
    if (num == workingBoard[row][curCol]) {
      return false;
    }
  }
  return true;
}

/**
 * check if num is in current row
 * 
 * @param {number} curRow 
 * @param {number} curCol 
 * @param {number} num 
 * @return {boolean}
 */
function checkRow(curRow, curCol, num) {
  for (let col = 0; col < 9; col++) {
    if (num == workingBoard[curRow][col]) {
      return false;
    }
  }
  return true;
}

/**
 * get the starting coordinate for respective square
 * 
 * @param {number} rowOrCol 
 * @return {number}
 */
function getSquareCoordinates(rowOrCol) {
  if (rowOrCol < 3) {
    return 0;
  }
  if (rowOrCol < 6) {
    return 3;
  }
  return 6;
}

/**
 * check if solution is correct
 * 
 * @param {number[][]} board
 * @return {boolean}
 */
function verifySolution(board) {
  for (let row = 0; row < 9; row++) {
    let numbers = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    for (let col = 0; col < 9; col++) {
      let num = board[row][col];
      if (num > 9 || num < 1 || --numbers[num - 1] < 0) {
        return false;
      }
    }
  }
  return true;
}

/**
 * check if board (usually incompleted) can potentially
 *  be solved
 * 
 * @param {number[][]} board 
 * @return {boolean}
 */
function isBoardValid(board) {
  if (!validBoardRows(board)) return false;
  if (!validBoardCols(board)) return false;
  if (!validBoardSquares(board)) return false;
  return true;
}

/**
 * check if the board's rows have duplicate numbers
 * 
 * @param {number[][]} board 
 * @return {boolean}
 */
function validBoardRows(board) {
  for (let row = 0; row < 9; row++) {
    let numbers = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    for (let col = 0; col < 9; col++) {
      let num = board[row][col];
      if (num != 0 && --numbers[num - 1] < 0) {
        return false;
      }
    }
  }
  return true;
}

/**
 * check if the board's columns have duplicate numbers
 * 
 * @param {number[][]} board 
 * @return {boolean}
 */
function validBoardCols(board) {
  for (let col = 0; col < 9; col++) {
    let numbers = [1, 1, 1, 1, 1, 1, 1, 1, 1];
    for (let row = 0; row < 9; row++) {
      let num = board[row][col];
      if (num != 0 && --numbers[num - 1] < 0) {
        return false;
      }
    }
  }
  return true;
}

/**
 * check if the board's squares have duplicate numbers
 * 
 * @param {number[][]} board 
 * @return {boolean}
 */
function validBoardSquares(board) {
  for (let row = 0; row < 9; row += 3) {
    for (let col = 0; col < 9; col += 3) {
      let numbers = [1, 1, 1, 1, 1, 1, 1, 1, 1];
      let square = getSquareAsArray(board, row, col);
      for (let i = 0; i < 9; i++) {
        let num = square[i];
        if (num != 0 && --numbers[num - 1] < 0) {
          return false;
        }
      }
    }
  }
  return true;
}

/**
 * return the current square as an array
 * 
 * @param {*} board 
 * @param {*} curRow 
 * @param {*} curCol 
 * @return {number[]}
 */
function getSquareAsArray(board, curRow, curCol) {
  let quadRow = getSquareCoordinates(curRow);
  let quadCol = getSquareCoordinates(curCol);
  let square = [9];
  let i = 0;
  for (let row = quadRow; row < quadRow + 3; row++) {
    for (let col = quadCol; col < quadCol + 3; col++) {
      square[i++] = board[row][col];
    }
  }
  return square;
}
