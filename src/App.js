import React, { useState, useEffect } from "react";
import "./App.css";
import WordInput from "./components/wordInput/wordInput.component";
import WordList from "./components/wordList/wordList.component";
import Button from "./components/button/button.component";
import Board from "./components/board/board.component";
import { Solver } from "./solver.js";
const boardDimensions = 9;
const emptyBoardTile = "*";
function App() {
  const [words, setWords] = useState([]);
  const [letterInput, setLetters] = useState("alphabet");
  const [selectedRow, setSelectedRow] = useState(0);
  const [selectedCol, setSelectedCol] = useState(0);
  const [selectedWord, setSelectedWord] = useState(null);
  const [hoverRow, setHoverRow] = useState(0);
  const [hoverColumn, setHoverColumn] = useState(0);
  const [wordDirection, setWordDirection] = useState("horizontal");
  const [mapDetails, setMapDetails] = useState([boardDimensions]);
  const [wordsPlaced, addWordPlaced] = useState([]); // simple array list of words put on map

  function createEmptyBoard() {
    let emptyBoard = [boardDimensions];
    for (let row = 0; row < boardDimensions; row++) {
      emptyBoard[row] = Array(boardDimensions);
      for (let col = 0; col < boardDimensions; col++) {
        emptyBoard[row][col] = emptyBoardTile;
      }
    }
    return emptyBoard;
  }
  // for useEffect, if second argument is empty array it behaves like componentDidMount *only*
  useEffect(() => {
    // code to run on component mount
    let emptyBoard = createEmptyBoard();
    setMapDetails(emptyBoard);
    const myStorage = window.localStorage;
    const savedMap = myStorage.getItem("map");
    if (savedMap) {
      setMapDetailsFromSave(savedMap);
    }
  }, []);

  /*
    Saved map looks like
    A,B,L,E,*,*,*
    *,*,*,*,*,*,*
    *,*,*,*,*,*,*
    So, we need to remove all commas
    */
  function setMapDetailsFromSave(savedData) {
    const fixedData = savedData.replace(new RegExp(",", "g"), "");
    let emptyBoard = [boardDimensions];
    for (let row = 0; row < boardDimensions; row++) {
      emptyBoard[row] = Array(boardDimensions);
      for (let col = 0; col < boardDimensions; col++) {
        emptyBoard[row][col] = fixedData[row * boardDimensions + col];
      }
    }
    setMapDetails(emptyBoard);
  }

  function solve() {
    handleSolveClick();
  }

  const handleSolveClick = React.useCallback(() => {
    const words = Solver(letterInput);
    setWords(words);

    var min = null;
    for (let i = 0; i < words.length; i++) {
      if (words[i].length < min || !min) {
        min = words[i].length;
      }
    }
    if (!min) {
      min = 2;
    }

    var max = null;
    for (let i = 0; i < words.length; i++) {
      if (words[i].length > max || !max) {
        max = words[i].length;
      }
    }
    if (!max) {
      max = 2;
    }
    console.log("Total words found = ", words.length);
  }, [letterInput, setWords]);

  function handleKeyPress(e) {
    console.log("e = ", e);
    setLetters(e.target.value);
    if (e.key === "Enter") {
      handleSolveClick();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleSolveClick();
  }

  function tileClick(e) {
    const value = e.target.getAttribute("id").split(",");
    const startcol = parseInt(e.target.getAttribute("startcol"));
    const startrow = parseInt(e.target.getAttribute("startrow"));

    const row = parseInt(value[0]);
    const col = parseInt(value[1]);

    setSelectedCol(col);
    setSelectedRow(row);

    let emptyBoard = [boardDimensions];
    for (let row = 0; row < boardDimensions; row++) {
      emptyBoard[row] = Array(boardDimensions);
      for (let col = 0; col < boardDimensions; col++) {
        emptyBoard[row][col] = mapDetails[row][col];
      }
    }

    if (selectedWord) {
      if (wordDirection === "vertical") {
        for (let i = 0; i < selectedWord.length; i++) {
          emptyBoard[startrow + i][startcol] = selectedWord[i];
        }
      } else {
        for (let i = 0; i < selectedWord.length; i++) {
          emptyBoard[startrow][startcol + i] = selectedWord[i];
        }
      }
      setMapDetails(emptyBoard);
      // wordsPlaced.push(selectedWord);
      // addWordPlaced(selectedWord); // needs to be smarter array
      setSelectedWord(null);
    }
  }

  function mouseOver(e) {
    const value = e.target.getAttribute("id").split(",");
    const row = parseInt(value[0]);
    const col = parseInt(value[1]);
    setHoverColumn(col);
    setHoverRow(row);
  }

  function onSelectWord(word) {
    setSelectedWord(word);
  }

  function handleGlobalKeyPress(e) {
    if (e.key === " ") {
      if (wordDirection === "vertical") {
        setWordDirection("horizontal");
      } else {
        setWordDirection("vertical");
      }
    }
  }

  function handleDirectionFlip(e) {
    e.preventDefault();
    if (wordDirection === "vertical") {
      setWordDirection("horizontal");
    } else {
      setWordDirection("vertical");
    }
  }

  function handleReset() {
    let emptyBoard = createEmptyBoard();
    setMapDetails(emptyBoard);
    setWords([]);
    setSelectedWord(null);
    setSelectedRow(0);
    setSelectedCol(0);
    setHoverRow(0);
    setHoverColumn(0);
  }
  function handleSave() {
    const myStorage = window.localStorage;
    localStorage.setItem("map", mapDetails);
  }

  return (
    <div className="App">
      <div
        className="Board"
        tabIndex="0"
        onContextMenu={handleDirectionFlip}
        onKeyPress={handleGlobalKeyPress}
      >
        <Board
          onClick={tileClick}
          onMouseOver={mouseOver}
          onKeyDown={handleGlobalKeyPress}
          selectedWord={selectedWord}
          hoverColumn={hoverColumn}
          hoverRow={hoverRow}
          wordDirection={wordDirection}
          boardDetails={mapDetails}
        />
      </div>
      <div className="Tools">
        <WordInput
          value={letterInput}
          onKeyPress={handleKeyPress}
          onSubmit={handleSubmit}
        />
        <Button text="solve" onClick={solve} />
        <WordList words={words} onSelect={onSelectWord} />
        <Button text="reset" onClick={handleReset} />
        <Button text="save" onClick={handleSave} />
      </div>
    </div>
  );
}

export default App;
