import React, { useRef, useEffect } from "react";
import "./board.component.css";
import { Animated } from "react-animated-css";

const boardDimensions = 10;
const emptyBoardTile = "*";

function Board(props) {
  let boardRef = useRef(null);

  useEffect(() => {
    boardRef.focus();
  });

  function createTiles() {
    let divs = [];
    let count = 0;

    const word = props.placingWord;
    const selectedWord = props.selectedWordDetails;
    let startCol = null;
    let endCol = null;
    let startRow = null;
    let endRow = null;
    // If placing word, do the stuff for that here
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

    // Create normal board
    for (let row = 0; row < boardDimensions; row++) {
      for (let col = 0; col < boardDimensions; col++) {
        let tileSubClass = props.isEditor
          ? "tileElementUnused"
          : "tileElementBlank";
        const animateMe =
          props.revealedDetails[row] && props.revealedDetails[row][col]
            ? props.revealedDetails[row][col].animateMe
            : false;
        const animateName = animateMe
          ? props.revealedDetails[row][col].revealedType === "word"
            ? "wobble"
            : "tada"
          : "";
        let internalValue = props.isEditor ? "." : "";
        if (
          props.boardDetails[row] &&
          props.boardDetails[row][col] !== emptyBoardTile
        ) {
          if (props.revealedDetails[row][col]?.revealed || props.isEditor) {
            internalValue = props.boardDetails[row][col];
          }
          tileSubClass = "tileElementUsed";
          if (
            props.revealedDetails[row][col]?.revealed &&
            props.revealedDetails[row][col].revealed &&
            props.revealedDetails[row][col]?.revealedType === "cheat"
          ) {
            tileSubClass = "tileElementUsedViaCheat";
          }
          if (
            selectedWord &&
            row >= selectedWord.startRow &&
            row <= selectedWord.endRow &&
            col >= selectedWord.startCol &&
            col <= selectedWord.endCol
          ) {
            tileSubClass = "tileElementUsedSelected";
          }
        }
        if (
          props.wordDirection !== "vertical" &&
          startCol != null &&
          row === startRow &&
          col >= startCol &&
          col < endCol
        ) {
          const wordIndex = col - startCol;
          internalValue = word[wordIndex];
          tileSubClass = "tileElementPlacing";
        } else if (
          startRow != null &&
          col === startCol &&
          row >= startRow &&
          row < endRow
        ) {
          const wordIndex = row - startRow;
          internalValue = word[wordIndex];
          tileSubClass = "tileElementPlacing";
        }

        divs.push(
          <div>
            {animateMe && (
              <Animated
                animationIn={animateName}
                animationInDuration={500}
                visible={true}
              >
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
              </Animated>
            )}
            {!animateMe && (
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
            )}
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
