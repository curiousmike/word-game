import React from "react";
import "./board.component.css";

const boardDimensions = 10;

function createTiles() {
  let divs = [];
  for (let row = 0; row < boardDimensions; row++) {
    for (let col = 0; col < boardDimensions; col++) {
      divs.push(<div key={row * col}>{(row + 1) * col}</div>);
    }
  }
  return divs;
}
function Board(props) {
  var renderedOutput = createTiles();
  return <div className="boardContainer">{renderedOutput}</div>;
}

export default Board;
