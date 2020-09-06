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
  return (
    // <div className={classes.container}>
    <div>
      <form onSubmit={props.onSubmit}>
        <input
          placeholder="enter letters here"
          defaultValue={props.value}
          onChange={props.onChange}
          onKeyUp={props.onKeyPress}
          label="Enter letters here"
        />
      </form>
    </div>
  );
}

export default WordInput;
