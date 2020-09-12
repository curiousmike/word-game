import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import WordInput from "./components/wordInput/wordInput.component";
import WordList from "./components/wordList/wordList.component";
import Button from "./components/button/button.component";
import Board from "./components/board/board.component";
import { Solver } from "./solver.js";
const boardDimensions = 10;
const emptyBoardTile = "*";
function App() {
  const [wordsFound, setWordsFound] = useState([]);
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
  const [isEditor, setIsEditor] = useState(true);
  const boardRef = useRef(null); // using this to set the board to focus once word is selected.  This makes keyboard interactivity work immediately

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

  // when a word is selected, give the board focus.
  useEffect(() => {
    boardRef.current.focus();
  }, [selectedWord]);

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
    setWordsFound(allMapData[mapSaveIndex].wordsFound);
  }

  function solve() {
    handleSolveClick();
  }

  const handleSolveClick = React.useCallback(() => {
    const wordsFound = Solver(letterInput);
    setWordsFound(wordsFound);
  }, [letterInput, setWordsFound]);

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
    setWordsFound([]);
    setWordsPlaced([]);
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
    newMapData.wordsFound = wordsFound;
    let currentMapData = allMapData;
    currentMapData.push(newMapData);

    const myStorage = window.localStorage;
    myStorage.setItem("map", JSON.stringify(currentMapData));
  }

  function handlePreview() {
    setIsEditor(!isEditor);
  }
  function boardOnFocus() {
    console.log("board got focus");
  }
  function boardOnBlur() {
    console.log("board on blur");
  }

  return (
    <div className="App">
      <div
        className="Board"
        tabIndex="0"
        onContextMenu={handleDirectionFlip}
        onKeyPress={handleGlobalKeyPress}
        onFocus={boardOnFocus}
        onBlur={boardOnBlur}
        ref={boardRef}
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
          isEditor={isEditor}
        />
      </div>
      {/* <div className="letterChoicesContainer">here</div> */}
      <div className="Tools">
        <div className="wordInputContainer">
          <WordInput
            value={letterInput}
            onChange={handleLettersChanged}
            onSubmit={handleSubmit}
          />
          <Button text="Solve" onClick={solve} />
        </div>
        <WordList words={wordsFound} onSelect={onSelectWord} />
        <Button text="Reset map" onClick={handleReset} />
        <div className="mapLoadSave">
          <form>
            <input placeholder="Map name to load" onChange={setSaveMapName} />
          </form>
          File Loaded ={" "}
          <span className="fileName">
            {mapSaveName ? mapSaveName : "no file"}
          </span>
          <Button text="save" onClick={handleSave} />
        </div>
        <Button
          text={isEditor ? "Preview Game OFF" : "Preview Game ON"}
          onClick={handlePreview}
        />
      </div>
    </div>
  );
}

export default App;
