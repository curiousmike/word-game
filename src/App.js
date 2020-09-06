import React, { useState } from "react";
import "./App.css";
import WordInput from "./components/wordInput/wordInput.component";
import WordList from "./components/wordList/wordList.component";
import Button from "./components/button/button.component";
import Board from "./components/board/board.component";
import { Solver } from "./solver.js";

function App() {
  const [words, setWords] = useState([]);
  const [letterInput, setLetters] = useState("");
  const [minWordLength, setMinWordLength] = useState(0);
  const [maxWordLength, setMaxWordLength] = useState(0);

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
    setMinWordLength(min);

    var max = null;
    for (let i = 0; i < words.length; i++) {
      if (words[i].length > max || !max) {
        max = words[i].length;
      }
    }
    if (!max) {
      max = 2;
    }
    setMaxWordLength(max);
    console.log("Total words found = ", words.length);
  }, [letterInput, setWords]);

  function handleKeyPress(e) {
    setLetters(e.target.value);
    if (e.key === "Enter") {
      handleSolveClick();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleSolveClick();
  }

  return (
    <div className="App">
      <div class="Board">
        <Board />
      </div>
      <div class="Tools">
        <WordInput
          value={letterInput}
          onKeyPress={handleKeyPress}
          onSubmit={handleSubmit}
        />
        <Button text="solve" onClick={solve} />
        <WordList words={words} />
      </div>
    </div>
  );
}

export default App;
