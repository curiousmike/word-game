import React from "react";
import { Animated } from "react-animated-css";

import "./footerSolver.component.css";

function FooterSolver(props) {
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
  let wordEnteredAnimation = "";
  let animDuration = 250;
  if (props.wordEntered) {
    wordEnteredAnimation = "fadeOutRight"; //zoomOut";
    animDuration = 250;
  }
  if (props.wordDuplicate) {
    wordEnteredAnimation = "shake";
  }
  if (props.wordNotFound) {
    wordEnteredAnimation = "tada";
  }
  let playWordEnteredAnim = false;
  if (props.wordEntered || props.wordDuplicate || props.wordNotFound) {
    playWordEnteredAnim = true;
  }
  return (
    <div className="footerSolver">
      {props.invalidEntry && (
        <Animated
          animationIn={"shake"}
          animationInDuration={animDuration}
          visible={true}
        >
          <div className="letterElements">{letterElements}</div>
        </Animated>
      )}
      {!props.invalidEntry && (
        <div className="letterElements">{letterElements}</div>
      )}
      {playWordEnteredAnim && (
        <Animated
          animationIn={wordEnteredAnimation}
          animationInDuration={animDuration}
          visible={true}
        >
          <div className="typedLetters">{typedLetters}</div>
        </Animated>
      )}
      {!playWordEnteredAnim && (
        <div className="typedLetters">{typedLetters}</div>
      )}
    </div>
  );
}

export default FooterSolver;
