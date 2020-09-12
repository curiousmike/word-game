import React, { useState, useEffect } from "react";
import "./App.css";
import WordInput from "./components/wordInput/wordInput.component";
import WordList from "./components/wordList/wordList.component";
import Button from "./components/button/button.component";
import Board from "./components/board/board.component";
import { Solver } from "./solver.js";
const boardDimensions = 10;
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
  const [wordsPlaced, setWordsPlaced] = useState([]); // simple array list of words put on map
  const [mapSaveName, setMapSaveName] = useState(null);
  const [allMapData, setAllMapData] = useState([]); // the loaded / saved maps.

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
    loadMaps();
    document.addEventListener("keydown", escFunction, false);
  }, []);

  function escFunction(event) {
    if (event.keyCode === 27) {
      setSelectedWord(null);
    }
  }
  useEffect(() => {
    if (allMapData.length > 0) {
      setMapDetailsFromSave(0);
    }
  }, [allMapData]);

  useEffect(() => {
    console.log("words placed changed - ", wordsPlaced);
    createBoardWithPlacedWords();
  }, [wordsPlaced]);

  function loadMaps() {
    const myStorage = window.localStorage;
    // myStorage.clear(); // Resets all saved data
    const mapData = JSON.parse(myStorage.getItem("map"));
    setAllMapData(mapData ? mapData : []);
  }

  function createBoardWithPlacedWords(mapSaveIndex = 0) {
    let newBoard = [boardDimensions];
    for (let row = 0; row < boardDimensions; row++) {
      newBoard[row] = Array(boardDimensions);
      for (let col = 0; col < boardDimensions; col++) {
        newBoard[row][col] = emptyBoardTile;
      }
    }
    for (let i = 0; i < wordsPlaced.length; i++) {
      const { word, direction, startCol, startRow } = wordsPlaced[i];
      for (let j = 0; j < word.length; j++) {
        if (direction === "horizontal") {
          newBoard[startRow][startCol + j] = word[j];
        } else {
          newBoard[startRow + j][startCol] = word[j];
        }
      }
    }

    setMapDetails(newBoard);
    return newBoard;
  }

  /*
   */
  function setMapDetailsFromSave(mapSaveIndex) {
    createBoardWithPlacedWords(mapSaveIndex);
    setMapSaveName(allMapData[mapSaveIndex].name);
    setWordsPlaced(allMapData[mapSaveIndex].wordsPlaced);
    setLetters(allMapData[mapSaveIndex].letterInput);
    setWords(allMapData[mapSaveIndex].words);
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
  }, [letterInput, setWords]);

  function handleLettersChanged(letters) {
    setLetters(letters);
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

    if (selectedWord) {
      const wordPlacedDetails = {
        direction: wordDirection,
        startCol: startcol,
        startRow: startrow,
        word: selectedWord,
      };
      setWordsPlaced(wordsPlaced.concat(wordPlacedDetails));
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

  function setSaveMapName(e) {
    setMapSaveName(e.target.value);
  }

  function handleSave() {
    let newMapData = {};
    newMapData.name = mapSaveName;
    newMapData.wordsPlaced = wordsPlaced;
    newMapData.letterInput = letterInput;
    newMapData.words = words;
    let currentMapData = allMapData;
    currentMapData.push(newMapData);

    const myStorage = window.localStorage;
    myStorage.setItem("map", JSON.stringify(currentMapData));
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
          onChange={handleLettersChanged}
          onSubmit={handleSubmit}
        />
        <Button text="solve" onClick={solve} />
        <WordList words={words} onSelect={onSelectWord} />
        <Button text="reset" onClick={handleReset} />
        <div>
          <form>
            <input
              placeholder="enter map name"
              label="Enter letters here"
              onChange={setSaveMapName}
            />
          </form>
          <Button text="save" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

export default App;
