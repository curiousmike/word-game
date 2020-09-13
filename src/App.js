import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { Animated } from "react-animated-css";

import WordInput from "./components/wordInput/wordInput.component";
import WordList from "./components/wordList/wordList.component";
import Button from "./components/button/button.component";
import Board from "./components/board/board.component";
import FooterSolver from "./components/footerSolver/footerSolver.component";
import { Solver } from "./solver.js";
const boardDimensions = 10;
const emptyBoardTile = "*";
function App() {
  const [wordsFound, setWordsFound] = useState([]);
  const [letterInput, setLetters] = useState("alphabet");
  const [selectedWordDetails, setSelectedWordDetails] = useState(null);
  const [placingWord, setPlacingWord] = useState(null);
  const [hoverRow, setHoverRow] = useState(0);
  const [hoverColumn, setHoverColumn] = useState(0);
  const [wordDirection, setWordDirection] = useState("horizontal");
  const [mapDetails, setMapDetails] = useState([boardDimensions]);
  const [wordsPlaced, setWordsPlaced] = useState([]); // simple array list of words put on map
  const [mapSaveName, setMapSaveName] = useState(null);
  const [allMapData, setAllMapData] = useState([]); // the loaded / saved maps.
  const [isEditor, setIsEditor] = useState(true);
  const [typedLetters, setTypedLetters] = useState([]);
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
      setPlacingWord(null);
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
    //myStorage.clear(); // Resets all saved data
    const mapData = JSON.parse(myStorage.getItem("map"));
    setAllMapData(mapData ? mapData : []);
  }

  // when a word is selected, give the board focus.
  useEffect(() => {
    boardRef.current.focus();
  }, [placingWord]);

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
    setLetters(allMapData[mapSaveIndex].letterInput || "default");
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

  function doesWordExistHere(row, col) {
    for (var i = 0; i < wordsPlaced.length; i++) {
      const wordDetails = wordsPlaced[i];

      let wordLen = wordDetails.word.length;
      if (
        wordDetails.direction === "horizontal" &&
        col >= wordDetails.startCol &&
        col < wordDetails.startCol + wordLen &&
        wordDetails.startRow === row
      ) {
        const selectedWordDetails = {
          index: i,
          word: wordDetails.word,
          startCol: wordDetails.startCol,
          endCol: wordDetails.startCol + wordLen,
          startRow: wordDetails.startRow,
          endRow: wordDetails.startRow,
        };
        setSelectedWordDetails(selectedWordDetails);
        return true;
      }
      if (
        wordDetails.direction === "vertical" &&
        row >= wordDetails.startRow &&
        row < wordDetails.startRow + wordLen &&
        wordDetails.startCol === col
      ) {
        const selectedWordDetails = {
          index: i,
          word: wordDetails.word,
          startCol: wordDetails.startCol,
          endCol: wordDetails.startCol,
          startRow: wordDetails.startRow,
          endRow: wordDetails.startRow + wordLen,
        };
        setSelectedWordDetails(selectedWordDetails);
        return true;
      }
    }
    setSelectedWordDetails(null);
    return false;
  }

  function tileClick(e) {
    const value = e.target.getAttribute("id").split(",");
    const startcol = parseInt(e.target.getAttribute("startcol"));
    const startrow = parseInt(e.target.getAttribute("startrow"));

    const row = parseInt(value[0]);
    const col = parseInt(value[1]);

    if (placingWord) {
      const wordPlacedDetails = {
        direction: wordDirection,
        startCol: startcol,
        startRow: startrow,
        word: placingWord,
      };
      setWordsPlaced(wordsPlaced.concat(wordPlacedDetails));
      setPlacingWord(null);
    } else {
      if (doesWordExistHere(row, col)) {
        console.log("yes");
      } else {
        console.log("no");
      }
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
    setPlacingWord(word);
  }

  function flipWordDirection() {
    if (wordDirection === "vertical") {
      setWordDirection("horizontal");
    } else {
      setWordDirection("vertical");
    }
  }

  function handleWordDeposited() {
    const wordDeposited = typedLetters.toUpperCase();
    let bFoundOnMap = false;
    let bFoundInBank = false;
    for (let i = 0; i < wordsPlaced.length; i++) {
      if (wordDeposited === wordsPlaced[i].word) {
        bFoundOnMap = true;
        break;
      }
    }
    if (!bFoundOnMap) {
      for (let i = 0; i < wordsFound.length; i++) {
        if (wordDeposited === wordsFound[i]) {
          bFoundInBank = true;
          break;
        }
      }
    }
    if (bFoundOnMap) {
      console.log("Found on map = ", wordDeposited);
    }
    if (bFoundInBank) {
      console.log("Found in bank = ", wordDeposited);
    }
    if (!bFoundOnMap && !bFoundInBank) {
      console.log("not found at all.");
    }
  }
  function handleGlobalKeyPress(e) {
    if (e.key === " ") {
      flipWordDirection();
    } else if (e.key === "Enter") {
      handleWordDeposited();
      setTypedLetters([]);
    } else if (e.key === "Backspace") {
      let newString = typedLetters.substring(0, typedLetters.length - 1);
      setTypedLetters(newString);
    } else {
      if (typedLetters.length < boardDimensions) {
        const newString = typedLetters + e.key;
        setTypedLetters(newString);
        console.log("newstring = ", newString);
      }
    }
  }

  function handleDirectionFlip(e) {
    e.preventDefault();
    flipWordDirection();
  }

  function handleDeleteSelected(e) {
    e.preventDefault();
    if (selectedWordDetails) {
      const updateWordsPlaced = wordsPlaced.filter(
        (word) => word.word !== selectedWordDetails.word
      );
      setWordsPlaced(updateWordsPlaced);
      setSelectedWordDetails(null);
    }
  }

  function handleReset() {
    let emptyBoard = createEmptyBoard();
    setMapDetails(emptyBoard);
    setWordsFound([]);
    setWordsPlaced([]);
    setPlacingWord(null);
    setHoverRow(0);
    setHoverColumn(0);
    setSelectedWordDetails(null);
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
  function onWheel() {
    flipWordDirection();
  }

  function handleWordEntry(word) {
    console.log("word entered = ", word);
  }

  return (
    <div className="App">
      <div
        className="Board"
        tabIndex="0"
        onContextMenu={handleDeleteSelected}
        onKeyDown={handleGlobalKeyPress}
        onFocus={boardOnFocus}
        onBlur={boardOnBlur}
        ref={boardRef}
        onWheel={onWheel}
      >
        <Animated
          animationIn="bounceInLeft"
          animationOut="fadeOut"
          isVisible={true}
        >
          <Board
            onClick={tileClick}
            onMouseOver={mouseOver}
            onKeyDown={handleGlobalKeyPress}
            placingWord={placingWord}
            hoverColumn={hoverColumn}
            hoverRow={hoverRow}
            wordDirection={wordDirection}
            boardDetails={mapDetails}
            isEditor={isEditor}
            selectedWordDetails={selectedWordDetails}
          />
        </Animated>
      </div>
      <div className="FooterSolver">
        <Animated
          animationIn="bounceInLeft"
          animationOut="fadeOut"
          isVisible={true}
        >
          <FooterSolver
            letters={letterInput}
            typedLetters={typedLetters}
            onSubmit={handleWordEntry}
          />
        </Animated>
      </div>
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
