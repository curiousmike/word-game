import React from "react";
import "./wordInput.component.css";

function WordInput(props) {
  function handleChange(e) {
    if (e.key === "Enter") {
      props.onSubmit();
    } else {
      props.onChange(e.target.value);
    }
  }
  return (
    <div className="wordInput">
      <form onSubmit={props.onSubmit}>
        <input
          placeholder="enter letters here"
          onChange={handleChange}
          value={props.value}
          onKeyUp={props.onKeyPress}
          label="Enter letters here"
        />
      </form>
    </div>
  );
}

export default WordInput;
