/**
 * reject non-numerical input
 * 
 * @param {*} evt 
 * @returns {boolean}
 */
function isValidKey(evt) {
  var charCode = evt.which ? evt.which : event.keyCode;
  if (charCode > 31 && (charCode < 49 || charCode > 57)) return false;

  return true;
};

function clear() {
  clearAllBoxes();
};

function clearAllBoxes() {
  doForAllBoxes((box) => {
    box.value = "";
  });
  updateSolveStatus(true);
};

/**
 * 
 * @param {function} fcn 
 */
function doForAllBoxes(fcn) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      let box = document.getElementById("bid" + row + col);
      fcn(box, row, col);
    }
  }
};

/**
 * 
 * @param {boolean} showSolvedBoard 
 */
function tryToSolve(showSolvedBoard) {
  copyToUserBoard();

  let solved = solve();
  if (solved && showSolvedBoard) {
    fillFromSolvedBoard();
  }
  updateSolveStatus(solved);
};

/**
 * 
 * @param {boolean} isSolvable 
 */
function updateSolveStatus (isSolvable){
  let solveStatus = document.getElementById("solveStatus");

  if (isSolvable) {
    solveStatus.innerHTML = "yes";
    solveStatus.style.color = "green";
  } else {
    solveStatus.innerHTML = "no";
    solveStatus.style.color = "red";
  }
};


function copyToBaseBoard() {
  doForAllBoxes((box, row, col) => {
    if (box.value == "") {
      baseBoard[row][col] = 0;
    } else {
      baseBoard[row][col] = parseInt(box.value);
    }
  });
};

function copyToUserBoard() {
  doForAllBoxes((box, row, col) => {
    if (box.value == "") {
      userBoard[row][col] = 0;
    } else {
      userBoard[row][col] = parseInt(box.value);
    }
  });
};

function fillFromBaseBoard() {
  doForAllBoxes((box, row, col) => {
    if (baseBoard[row][col] == 0) {
      box.value = "";
    } else {
      box.value = baseBoard[row][col];
    }
  });
};

function  fillFromSolvedBoard() {
  doForAllBoxes((box, row, col) => {
    box.value = solvedBoard[row][col];
  });
};

function createSudokuBoard(divID) {
  let div = document.getElementById(divID);

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      let coord = "" + row + col;
      let colorbox = "whitebox";
      let topOrBottomRow = row < 3 || row > 5;
      let middleCol = col > 2 && col < 6;
      if ((topOrBottomRow && middleCol) || !(topOrBottomRow || middleCol)) {
        colorbox = "greybox";
      }
      div.innerHTML +=
        '<input type="text" id="bid' +
        coord +
        '" class="box b' +
        coord +
        " " +
        colorbox +
        '" maxlength="1" onkeypress="return isValidKey(event,' +
        row +
        "," +
        col +
        ');" style="grid-area: b' +
        row +
        col +
        ';">';
    }
  }
};

function init() {
  createSudokuBoard("boardArea");
  fillFromBaseBoard();
  tryToSolve(false);
};
