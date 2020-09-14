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

  function hasLetterBeenUsed(letter) {
    for (let i = 0; i < props.typedLetters.length; i++) {
      if (props.typedLetters[i] === letter) {
        return true;
      }
    }
    return false;
  }

  function generateLetterElements() {
    let spans = [];
    let randomLetterSequence = generateRandomLetterSequence();
    for (let i = 0; i < randomLetterSequence.length; i++) {
      let className = hasLetterBeenUsed(randomLetterSequence[i])
        ? "singleLetterHighlight"
        : "singleLetter";
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
