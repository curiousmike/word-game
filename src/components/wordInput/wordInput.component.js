import React from "react";

// const useStyles = makeStyles({
//   input: {
//     background: "#DAF7A6",
//     "text-align": "center",
//   },
//   inputText: {
//     fontSize: "28px",
//   },
//   container: {
//     margin: "0px auto 8px",
//     textAlign: "center",
//   },
// });

function WordInput(props) {
  //   const classes = useStyles();
  function handleChange (e) {
    if (e.key === "Enter"){
      props.onSubmit();
    } else {
    props.onChange(e.target.value);
    }
  }
  return (
    // <div className={classes.container}>
    <div>
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
