/*
 * Repl.tsx
 * Updated Nov. 3rd, 2020
 * Ben Friedman
 *
 * Represents the Read Evaluate Print Loop (Interpreter) of the online BoGL editor
 */

import React, { useState } from 'react';
import Terminal from 'terminal-in-react';
import {apiRequestRunCode} from '../Utilities/BoGLServerRequest';
import {decodeValue,decodeExprType,decodeError,decodeResponse} from './Decode';


// an expression like place(1,b,(1,1)) evaluates to a board and it also adds the same board to
// the print buffer. This makes sure we do not print duplicate boards.
// an expression could modify two boards to be identical, in that case it may be confusing to
// only print one board, but that is a much less common use case that the first one.
/*
const extendBoardsString = (board, value, boards) => {
    let boardStr = decodeBoard(board["value"]);
    if (boardStr !== value) boards = boards + boardStr + value + "\n";
}
*/


/*
 * Repl React function component
 */
const Repl = (props) => {

  // Default is an empty buffer
  const [inputBuffer, setInputBuffer] = useState(Array<any>());

  // input mode: True is input mode, False is regular
  // default is 'False'
  const [inputMode, setInputMode] = useState(false);

  // whether to report the type of the current expr
  // default is 'False'
  let shouldReportExprType = false;

  // last expression we evaluated in the Repl
  // when in Input mode, this is the expression we send, and the input buffer
  // is updated instead
  const [lastReplExpression, setLastReplExpression] = useState("");

  /*
   * enterInputMode
   * Sets input mode true
   */
  const enterInputMode = (expr) => {
    setInputMode(true);
    setLastReplExpression(expr)
  }

  /*
   * exitInputMode
   * Clears the input buffer, set input mode false, clears replExpression
   * Used after input has been fully accepted, or 'clear' has been entered
   */
  const exitInputMode = () => {
    setInputBuffer([]);
    setInputMode(false);
    setLastReplExpression("")
  }

  /*
   * Called when clear is pressed
   */
  const clear = () => {
    exitInputMode();
    return " 🤖 BoGL Says: Ok, exiting Input Mode. ";
  }

  /*
   * pushToInputBuffer
   * Pushes an input into the inputBuffer
   *
   * nextInput  : The next input to push in
   */
  const pushToInputBuffer = (nextInput: string) => {
    let cpy = inputBuffer
    cpy.push({"input":nextInput})
    setInputBuffer(cpy)
  }


  /*
   * popFromInputBuffer
   * Pops the last input off the buffer, used when an error has occurred
   */
  const popFromInputBuffer = () => {
    let cpy = inputBuffer
    cpy.pop()
    setInputBuffer(cpy)
  }


  /*
   * handlePrompt
   * Handles prompt for BoGL input
   *
   * decoded: The decoded response we can use
   */
  const handlePrompt = (replExpression,decoded) => {
    let res = ""
    if(inputMode === false) {
      res += "\n 🤖 BoGL Says: Enter input, or \"clear\" to stop. \n";
      enterInputMode(replExpression);
    }

    // only show a decoded board if there is one
    if(decoded["boards"] && decoded["boards"] !== "") {
      res = decodeValue(decoded["boards"]) + res
    }

    return res
  }


  /*
   * handleTypeError
   * Handles reporting a BoGL type error
   *
   * decoded: The decoded response we can use
   */
  const handleTypeError = (decoded) => {
    let res = decoded["contents"]["message"]
    if(inputMode === true) {
      popFromInputBuffer();
      res += "\nYour last input was discarded.";
    }
    return res
  }


  /*
   * handleLanguageError
   * Handles reporting a BoGL parse error
   *
   * decoded: The decoded response we can use
   */
  const handleLanguageError = (decoded) => {
    let res = "Language Error: "+decoded["contents"][3];
    if(inputMode === true) {
      popFromInputBuffer();
      res += "\nYour last input was discarded.";
    }
    return res
  }


  /*
   * handleRuntimeError
   * Handles reporting a BoGL runtime error
   *
   * decoded: The decoded response we can use
   */
  const handleRuntimeError = (decoded) => {
    // Runtime Error
    let res = "Runtime Error: "+decoded["contents"];
    if(inputMode === true) {
      popFromInputBuffer();
      res += "\nYour last input was discarded.";
    }
    return res
  }


  /*
   * handleValue
   * Handles reporting a BoGL Value
   *
   * decoded: The decoded response we can use
   */
  const handleValue = (decoded) => {

    let res = "";

    // decode the value in the response
    res += decodeValue(decoded)

    // consider where we should report the type of the expression
    if(shouldReportExprType) {
      res += decodeExprType(decoded["type"]);
      shouldReportExprType = false;
    }

    // lastly, report whether we are out of input mode
    if(inputMode) {
      // exit input mode
      res += "\n\n 🤖 BoGL Says: Done reading input. \n";
      exitInputMode();
    }

    return res;

  }


  /*
   * handleResponse
   * Handles the response from the bogl API w/ the replExpression that produced it
   *
   * replExpression : Expr used to produce this response
   * responses :      Encoded reponse from the API
   */
  const handleResponse = (replExpression: string, responses: any) => {
    // get recent decoded response
    let decoded = decodeResponse(responses)

    // Check for exception cases
    if(decoded["category"] === "SpielPrompt") {
      // Prompt for input
      return handlePrompt(replExpression, decoded)

    } else if(decoded["category"] === "SpielTypeError") {
      // Type error
      return handleTypeError(decoded)

    } else if(decoded["category"] === "SpielParseError") {
      // Parse Error
      return handleLanguageError(decoded)

    } else if(decoded["category"] === "SpielRuntimeError") {
      // Runtime Error
      return handleRuntimeError(decoded)

    } else {
      // Regular BoGL value
      return handleValue(decoded)

    }
  }


  /*
   * runRepl
   * Sends execute command with input to back-end, and prints the response
   *
   * replExpression: Expression to run the Repl on
   * replPrint:      Callback function to print the response in the Repl
   */
  const runRepl = (replExpression: string, replPrint: any) => {
      let respStatus = 0;

      // check to ':t ' to request an expression result type
      let regex = /^:t\s+/;

      if (inputMode) {
          // push command to input buffer
          pushToInputBuffer(replExpression);
          // use last repl expression instead
          replExpression = lastReplExpression;

      }

      if(replExpression.match(regex)) {
        // pull off the prefaced type instruction,
        // and note that we would like to report a type once done
        replExpression = replExpression.replace(regex, '');
        shouldReportExprType = true;

      }

      apiRequestRunCode(fetch, props.preludeCode, props.programCode, replExpression, inputBuffer)
      .then(function(res) {
        // store & decode the response
        respStatus = res.status;
        return res.json();

      }).then((result) => {
        // print the decoded response
        replPrint(handleResponse(replExpression,result));

      }).catch((error) => {
        // print the decoded error
        replPrint(decodeError(error,respStatus))

        if(inputMode) {
          // in the case of input, assume we need to pop from the buffer to fix this
          popFromInputBuffer();
          replPrint("Your last input was discarded.")

        }
      });

  }


  // React renderable component
  return (
      <Terminal
          color='#606c71'
          backgroundColor='#f8f8f8'
          barColor='#f8f8f8'
          style={{ fontSize: "1.1em" }}
          showActions={false}
          commands={{
              "clear": clear,
          }}
          commandPassThrough={(cmd: any, print) => {
              let expr = (cmd instanceof Array) ? cmd.join(" ") : cmd;
              runRepl(expr, print);

          }}
          allowTabs={false}
          hideTopBar={true}
          startState={"maximised"}
      />

  )

}

export {Repl};
