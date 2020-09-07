import React from "react";
import "./board.component.css";

const boardDimensions = 10;
// props = onClick onMouseOver selectedWord
function Board(props) {
  function createTiles() {
    let divs = [];
    let count = 0;

    const word = props.selectedWord;
    let startCol = null;
    let endCol = null;
    let startRow = null;
    if (word) {
      const wordLen = word.length;
      startCol = Math.floor(props.hoverColumn - wordLen / 2);
      if (startCol < 0) {
        startCol = 0;
      }
      if (startCol + wordLen > boardDimensions) {
        startCol = boardDimensions - wordLen;
      }
      endCol = startCol + wordLen;
      startRow = props.hoverRow;
    }

    for (let row = 0; row < boardDimensions; row++) {
      for (let col = 0; col < boardDimensions; col++) {
        const tileSubClass =
          (col + count) % 2 === 0 ? "tileElementEven" : "tileElementOdd";
        let internalValue = ".";
        if (
          startCol != null &&
          row === startRow &&
          col >= startCol &&
          col <= endCol
        ) {
          const wordIndex = col - startCol;
          console.log("wordIndex =", wordIndex);
          internalValue = props.selectedWord[wordIndex];
        }

        divs.push(
          <div
            className={"tileElement " + tileSubClass}
            key={col + row * count * boardDimensions}
            id={row + "," + col}
            onClick={props.onClick}
            onMouseOver={props.onMouseOver}
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

  return <div className="boardContainer">{renderedOutput}</div>;
}

export default Board;
