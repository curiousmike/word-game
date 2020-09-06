import React from "react";
import "./board.component.css";

const boardDimensions = 10;
// props = onClick onMouseOver selectedWord
function Board(props) {
  function createTiles() {
    let divs = [];
    let count = 0;
    for (let row = 0; row < boardDimensions; row++) {
      for (let col = 0; col < boardDimensions; col++) {
        const tileSubClass =
          (col + count) % 2 === 0 ? "tileElementEven" : "tileElementOdd";
        divs.push(
          <div
            className={"tileElement " + tileSubClass}
            key={col + row * count * boardDimensions}
            id={row + "," + col}
            onClick={props.onClick}
            onMouseOver={props.onMouseOver}
          >
            {row === props.row && col === props.column && props.selectedWord
              ? props.selectedWord
              : "x"}
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
