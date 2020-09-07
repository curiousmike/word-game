import React, { useRef, useEffect } from "react";
import "./board.component.css";

const boardDimensions = 9;
const emptyBoardTile = "*";

function Board(props) {
  let boardRef = useRef(null);

  useEffect(() => {
    boardRef.focus();
  });

  function createTiles() {
    let divs = [];
    let count = 0;

    const word = props.selectedWord;
    let startCol = null;
    let endCol = null;
    let startRow = null;
    let endRow = null;
    if (word) {
      const wordLen = word.length;
      if (props.wordDirection === "horizontal") {
        startCol = Math.floor(props.hoverColumn - wordLen / 2);
        if (startCol < 0) {
          startCol = 0;
        }
        if (startCol + wordLen > boardDimensions) {
          startCol = boardDimensions - wordLen;
        }
        endCol = startCol + wordLen;
        startRow = props.hoverRow;
      } else {
        startRow = Math.floor(props.hoverRow - wordLen / 2);
        if (startRow < 0) {
          startRow = 0;
        }
        if (startRow + wordLen > boardDimensions) {
          startRow = boardDimensions - wordLen;
        }
        endRow = startRow + wordLen;
        startCol = props.hoverColumn;
      }
    }

    for (let row = 0; row < boardDimensions; row++) {
      for (let col = 0; col < boardDimensions; col++) {
        let tileSubClass = "tileElementUnused";
        let internalValue = ".";
        if (
          props.boardDetails[row] &&
          props.boardDetails[row][col] !== emptyBoardTile
        ) {
          internalValue = props.boardDetails[row][col];
          tileSubClass = "tileElementUsed";
        }
        if (
          props.wordDirection !== "vertical" &&
          startCol != null &&
          row === startRow &&
          col >= startCol &&
          col < endCol
        ) {
          const wordIndex = col - startCol;
          internalValue = props.selectedWord[wordIndex];
          tileSubClass = "tileElementPlacing";
        } else if (
          startRow != null &&
          col === startCol &&
          row >= startRow &&
          row < endRow
        ) {
          const wordIndex = row - startRow;
          internalValue = props.selectedWord[wordIndex];
          tileSubClass = "tileElementPlacing";
        }

        divs.push(
          <div
            className={"tileElement " + tileSubClass}
            key={col + row * count * boardDimensions}
            id={row + "," + col}
            onClick={props.onClick}
            onMouseOver={props.onMouseOver}
            startcol={startCol}
            startrow={startRow}
          >
            {internalValue}
          </div>
        );
      }
      count++;
    }
    return divs;
  }

  var renderedOutput = createTiles();

  return (
    <div
      className="boardContainer"
      ref={(e) => {
        boardRef = e;
      }}
    >
      {renderedOutput}
    </div>
  );
}

export default Board;
