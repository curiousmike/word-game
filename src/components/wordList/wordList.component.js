import React, { useState } from "react";
import "./wordList.component.css";

function WordList(props) {
  const [foundWords, setWords] = useState(props.words);
  const { filterLength } = props;
  React.useEffect(() => {
    if (filterLength) {
      setWords(
        props.words.filter(function (word) {
          return word.length === filterLength;
        })
      );
    } else {
      setWords(props.words);
    }
  }, [props.words, filterLength]);

  function selectWord(e) {
    props.onSelect(e.target.innerText);
  }

  return (
    <ul className="wordList">
      {foundWords &&
        foundWords.map((word, index) => (
          <ul onClick={selectWord} key={index}>
            {word}
          </ul>
        ))}
    </ul>
  );
}

export default WordList;
