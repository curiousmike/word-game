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
  const [invalidLetterEntry, setInvalidLetterEntry] = useState(false);
  const [mapDeposit, makeMapDeposit] = useState([]);
  const [bankDeposit, makeBankDeposit] = useState([]);
  const [wordEntered, setWordEntered] = useState(false); //user types in a word and its accepted
  const [wordDuplicate, setWordDuplicate] = useState(false); //user types in a word and its accepted
  const [wordNotFound, setWordNotFound] = useState(false);
  const [revealedDetails, setRevealedDetails] = useState([boardDimensions]);
  const boardRef = useRef(null); // using this to set the board to focus once word is selected.  This makes keyboard interactivity work immediately

  function createEmptyBoard(tileType) {
    let emptyBoard = [boardDimensions];
    for (let row = 0; row < boardDimensions; row++) {
      emptyBoard[row] = Array(boardDimensions);
      for (let col = 0; col < boardDimensions; col++) {
        emptyBoard[row][col] = tileType;
      }
    }
    return emptyBoard;
  }
  // for useEffect, if second argument is empty array it behaves like componentDidMount *only*
  useEffect(() => {
    // code to run on component mount
    let emptyBoard = createEmptyBoard(emptyBoardTile);
    setMapDetails(emptyBoard);
    let emptyReveal = createEmptyBoard({
      revealed: false,
      revealedType: "word",
      animateMe: false,
    });
    setRevealedDetails(emptyReveal);
    loadMaps();
    document.addEventListener("keydown", escFunction, false);
  }, []);

  function escFunction(event) {
    if (event.keyCode === 27) {
      setPlacingWord(null);
      setSelectedWordDetails(null);
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
        // setSelectedWordDetails(selectedWordDetails);
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
        // setSelectedWordDetails(selectedWordDetails);
        return true;
      }
    }
    setSelectedWordDetails(null);
    return false;
  }

  //when using a cheat tile, did you finish a word?
  function didJustRevealNewWord() {
    return false;
  }

  function handleCheatTileReveal(row, col) {
    const copyOfRevealedDetails = [...revealedDetails];
    if (copyOfRevealedDetails[row][col].revealed === false) {
      copyOfRevealedDetails[row][col] = {
        revealed: true,
        revealedType: "cheat",
        animateMe: true,
      };
      setRevealedDetails(copyOfRevealedDetails);
      if (didJustRevealNewWord()) {
        console.log("reveal new word");
      }
    }
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
        handleCheatTileReveal(row, col);
      } else {
        console.log("no");
      }
    }
  }

  function mouseOver(e) {
    const value = e.target.getAttribute("id").split(",");
    const row = parseInt(value[0]);
    const col = parseInt(value[1]);
    if (col !== hoverColumn || row !== hoverRow) {
      setHoverColumn(col);
      setHoverRow(row);
    }
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
    const alreadyFoundInBank = bankDeposit.includes(wordDeposited);
    const alreadyFoundOnMap = mapDeposit.includes(wordDeposited);
    // verify the word entered doesn't already exist in the map or board
    if (!alreadyFoundInBank && !alreadyFoundOnMap) {
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
    }
    if (bFoundOnMap) {
      setWordEntered(true);
      setTimeout(() => finalizeMapDeposit(wordDeposited), 250);
    } else if (bFoundInBank) {
      setWordEntered(true);
      console.log("Found in bank = ", wordDeposited);
      setTimeout(() => finalizeBankDeposit(wordDeposited), 250);
    } else if (alreadyFoundInBank) {
      setWordDuplicate(true);
      setTimeout(() => finalizeWordDuplicate(), 250);
      console.log(wordDeposited + " already found in bank");
    } else if (alreadyFoundOnMap) {
      setWordDuplicate(true);
      setTimeout(() => finalizeWordDuplicate(), 250);
      console.log(wordDeposited + " already found on map");
    } else {
      setWordNotFound(true);
      setTimeout(() => finalizeWordNotFound(), 250);
      console.log("not found at all.");
    }
  }
  function finalizeMapDeposit(wordDeposited) {
    makeMapDeposit((mapDeposit) => [...mapDeposit, wordDeposited]);
    revealMapDeposit(wordDeposited);
    setWordEntered(false);
    setTypedLetters([]);
  }

  function revealMapDeposit(wordDeposited) {
    for (let i = 0; i < wordsPlaced.length; i++) {
      const { word, direction, startCol, startRow } = wordsPlaced[i];
      if (word === wordDeposited) {
        const copyOfRevealedDetails = [...revealedDetails];
        if (direction === "vertical") {
          for (let j = 0; j < wordDeposited.length; j++) {
            if (
              copyOfRevealedDetails[startRow + j][startCol].revealed === false
            ) {
              copyOfRevealedDetails[startRow + j][startCol] = {
                revealed: true,
                revealedType: "word",
                animateMe: true,
              };
              setRevealedDetails(copyOfRevealedDetails);
            }
          }
        }
        if (direction === "horizontal") {
          for (let j = 0; j < wordDeposited.length; j++) {
            if (
              copyOfRevealedDetails[startRow][startCol + j].revealed === false
            ) {
              copyOfRevealedDetails[startRow][startCol + j] = {
                revealed: true,
                revealedType: "word",
                animateMe: true,
              };
              setRevealedDetails(copyOfRevealedDetails);
            }
          }
        }

        break;
      }
    }
  }

  function finalizeBankDeposit(wordDeposited) {
    makeBankDeposit((bankDeposit) => [...bankDeposit, wordDeposited]);
    setWordEntered(false);
    setTypedLetters([]);
  }

  function finalizeWordNotFound() {
    setTypedLetters([]);
    setWordNotFound(false);
  }

  function finalizeWordDuplicate() {
    setTypedLetters([]);
    setWordDuplicate(false);
  }

  function handleGlobalKeyPress(e) {
    if (e.key === " ") {
      flipWordDirection();
    } else if (e.key === "Enter") {
      handleWordDeposited();
    } else if (e.key === "Backspace") {
      let newString = typedLetters.substring(0, typedLetters.length - 1);
      setTypedLetters(newString);
    } else {
      if (isOKToAddTypedLetter(e.key)) {
        // ensure the letter typed exists in puzzle letters
        if (typedLetters.length < boardDimensions) {
          const newString = typedLetters + e.key;
          setTypedLetters(newString);
        }
      } else {
        setInvalidLetterEntry(true);
        setTimeout(() => setInvalidLetterEntry(false), 250);
      }
    }
  }

  function isOKToAddTypedLetter(newLetter) {
    const theAlphabet = "abcdefghijklmnopqrstuvwxyz";
    // compare letters in puzzle to all letters typed.
    let letterCounts = [];
    let inputCounts = [];
    //reset counts
    for (var k = 0; k < theAlphabet.length; k++) {
      var letter = theAlphabet[k];
      letterCounts[letter] = 0;
      inputCounts[letter] = 0;
    }
    //build counts of possible letters
    for (let i = 0; i < letterInput.length; i++) {
      let character = letterInput[i];
      letterCounts[character]++;
    }
    if (letterCounts[letterInput] === 0) {
      // if there are no, for example Z's, just bail
      return false;
    }
    //build counts of inputted letters
    for (let i = 0; i < typedLetters.length; i++) {
      let character = typedLetters[i];
      inputCounts[character]++;
    }
    if (inputCounts[newLetter] + 1 <= letterCounts[newLetter]) {
      return true;
    }
    return false;
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
    let emptyReveal = createEmptyBoard();
    setRevealedDetails(emptyReveal);
    setWordsFound([]);
    setWordsPlaced([]);
    setPlacingWord(null);
    setHoverRow(0);
    setHoverColumn(0);
    setSelectedWordDetails(null);
    makeMapDeposit([]);
    makeBankDeposit([]);
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
            revealedDetails={revealedDetails}
            isEditor={isEditor}
            selectedWordDetails={selectedWordDetails}
          />
        </Animated>
      </div>
      <div className="FooterSolver">
        <FooterSolver
          letters={letterInput}
          typedLetters={typedLetters}
          wordEntered={wordEntered}
          wordDuplicate={wordDuplicate}
          wordNotFound={wordNotFound}
          onSubmit={handleWordEntry}
          invalidEntry={invalidLetterEntry}
        />
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
        <WordList words={mapDeposit} onSelect={() => {}} />
        <WordList words={bankDeposit} onSelect={() => {}} />
      </div>
    </div>
  );
}

export default App;
