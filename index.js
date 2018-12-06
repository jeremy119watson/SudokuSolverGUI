/**
 * enforce that box input is a single digit and update userboard
 *
 * @param {string} id
 * @param {number} row
 * @param {number} col
 */
function boxInput(id, row, col) {
  let box = document.getElementById(id);
  let value = box.value;
  if (value.length > 1) {
    box.value = value.slice(0, 1);
  }
  let intValue = parseInt(box.value);
  if (!intValue) {
    box.value = "";
    putValueInUserBoard(row, col, 0);;
  } else {
    let previousValue = getValueFromUserBoard(row, col);
    if (intValue != previousValue) {
      putValueInUserBoard(row, col, intValue);
      updateSolveStatus(null);
    }
  }
}

function clearAllValues() {
  doForAllBoxes(box => {
    box.value = "";
  });
  clearUserBoard();
  updateSolveStatus(true);
}

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
}

/**
 *
 * @param {boolean} showSolvedBoard
 */
function tryToSolve(showSolvedBoard) {

  let solved = solve();
  if (solved && showSolvedBoard) {
    fillBoxesFromSolvedBoard();
  }
  updateSolveStatus(solved);
}

/**
 *
 * @param {boolean} isSolvable
 */
function updateSolveStatus(isSolvable) {
  let solveStatus = document.getElementById("solveStatus");

  if (isSolvable) {
    solveStatus.innerHTML = "yes";
    solveStatus.style.color = "green";
  } else if (isSolvable == false) {
    solveStatus.innerHTML = "no";
    solveStatus.style.color = "red";
  } else {
    solveStatus.innerHTML = "?";
    solveStatus.style.color = "grey";
  }
}

function updateAllValuesOfUserBoard() {
  doForAllBoxes((box, row, col) => {
    let value = box.value;
    let intValue = value == "" ? 0 : parseInt(value);
    putValueInUserBoard(row, col, intValue);
  });
}

function fillBoxesFromUserBoard() {
  doForAllBoxes((box, row, col) => {
    let value = getValueFromUserBoard(row, col);
    box.value = value == 0 ? "" : value;
  });
}

function fillBoxesFromSolvedBoard() {
  doForAllBoxes((box, row, col) => {
    box.value = getValueFromSolvedBoard(row, col);
  });
  updateAllValuesOfUserBoard();
}

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
        '<input type="tel" id="bid' +
        coord +
        '" class="box b' +
        coord +
        " " +
        colorbox +
        '" min="1" max="9" oninput="boxInput(\'bid' +
        coord +
        "'," +
        row +
        "," +
        col +
        ');" style="grid-area: b' +
        row +
        col +
        ';">';
    }
  }
}

function init() {
  createSudokuBoard("boardArea");
  fillBoxesFromUserBoard();
  tryToSolve(false);
}
