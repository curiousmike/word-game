import React from "react";
// import { Animated } from "react-animated-css";

import "./levelComplete.component.css";

function LevelComplete(props) {
    function buildTypedLetterElements(string, classNameToUse) {
        let spans = [];
        for (let i = 0; i < string.length; i++) {
          spans.push(
            <span className={classNameToUse}>
              {string[i].toUpperCase()}
            </span>
          );
        }
        return spans;
      }
      const topLetters = buildTypedLetterElements('Level', "levelCompleteLetter");
      const levelValue = buildTypedLetterElements( `${props.level}`, "levelValue");
      const bottomLetters = buildTypedLetterElements('Complete!', "levelCompleteLetter");
    
  return (
    <div className={"levelCompleteContainer"}>
        <div>{topLetters} {levelValue}</div>
        <div>{bottomLetters}</div>
        <button>Continue</button>
    </div>
  );
}

export default LevelComplete;
