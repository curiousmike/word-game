import React from "react";
import { Animated } from "react-animated-css";

import "./footerSolver.component.css";

function FooterSolver(props) {
  function handleChange(e) {
    if (e.key === "Enter") {
      props.onSubmit();
    } else {
      props.onChange(e.target.value);
    }
  }

  function generateRandomLetterSequence() {
    return props.letters;
  }

  function buildHighlightedLetters() {
    // if you have DODDLE, and you type 'D' once, make sure only 1 D is highlighted
    let highlighted = [];
    for (let i = 0; i < props.letters.length; i++) {
      highlighted[i] = false;
    }
    for (let i = 0; i < props.typedLetters.length; i++) {
      for (var j = 0; j < props.letters.length; j++) {
        if (
          props.letters[j] === props.typedLetters[i] &&
          highlighted[j] === false
        ) {
          highlighted[j] = true;
          break;
        }
      }
    }
    return highlighted;
  }

  function generateLetterElements() {
    let spans = [];
    let randomLetterSequence = generateRandomLetterSequence();
    let itemsToHighlight = buildHighlightedLetters();
    for (let i = 0; i < randomLetterSequence.length; i++) {
      let className =
        itemsToHighlight[i] === true ? "singleLetterHighlight" : "singleLetter";
      spans.push(
        <span className={className} key={i}>
          {randomLetterSequence[i].toUpperCase()}
        </span>
      );
    }
    return spans;
  }

  function buildTypedLetterElements() {
    let spans = [];
    for (let i = 0; i < props.typedLetters.length; i++) {
      spans.push(
        <span className={"singleLetter"} key={i}>
          {props.typedLetters[i].toUpperCase()}
        </span>
      );
    }
    return spans;
  }

  const letterElements = generateLetterElements();
  const typedLetters = buildTypedLetterElements();
  console.log("invalid = ", props.invalidEntry);
  return (
    <div className="footerSolver">
      <div className="letterElements">{letterElements}</div>
      <Animated animationIn="bounce" isVisible={props.invalidEntry}>
        <div>INVALID KEY</div>
      </Animated>
      <div className="typedLetters">{typedLetters}</div>
    </div>
  );
}

export default FooterSolver;
