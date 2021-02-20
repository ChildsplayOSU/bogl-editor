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
import {extractGameNameFromProgram} from '../Utilities/ProgramUtils';
import {decodeValue,decodeExprType,decodeError} from './Decode';


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
    cpy.push(nextInput)
    setInputBuffer(cpy)
  }


  /*
   * popFromInputBufferWithMsg
   * Pops the last input off the buffer, used when an error has occurred, and returns a msg
   */
  const popFromInputBufferWithMsg = () => {
    let cpy = inputBuffer
    cpy.pop()
    setInputBuffer(cpy)
    return "\nYour last input was discarded. Please enter a new one."
  }


  /*
   * handlePrompt
   * Handles prompt for BoGL input
   *
   * decoded: The decoded response we can use
   */
  const handlePrompt = (replExpression,decoded) => {
    enterInputMode(replExpression);
    return "\n 🤖 BoGL Says: Enter input, or \"clear\" to stop. \n";
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
      res += popFromInputBufferWithMsg()
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
      res += popFromInputBufferWithMsg()
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
      res += popFromInputBufferWithMsg();
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
   * filterDuplicateBoards
   * Filters out duplicate decoded boards, only works on the strings, not the arrays
   * TODO: This should be patched on the backend in the future, this is a hack in the meantime
   * Once this if fixed in the way BoGL returns boards, this can be safely removed
   */
  const filterDuplicateBoards = (decodedBoards) => {
    return decodedBoards.filter((val,index) => decodedBoards.indexOf(val) === index)
  }


  /*
   * extractContent
   * Extracts the content for values from the response
   *
   * reponses: JSON obj containing the responses returned, types & content
   */
  const extractContent = (response: any) => {
    // get content part of the response, ignoring the type part 1st
    const contentPart = response[response.length - 1]

    // get category of response
    const category = contentPart["tag"]

    // get contents of response
    const contents = contentPart["contents"]

    // extract all boards from place operations
    // have to check, prompts do not define this, and we must substitute
    let boards = contents[0] !== undefined ? contents[0] : []

    if(category === "SpielPrompt") {
      // boards are contained within the contents directly for prompts, but only in this case
      boards = contents

    }

    // extract & set type & value of content, or blank if not present
    const typ   = contents[1] ? contents[1]["type"] : ""
    const value = contents[1] ? contents[1]["value"] : ""

    return {
      "category": category,
      "contents": contents,
      "type":     typ,
      "value":    value,
      "boards":   boards
    }
  }


  /*
   * handleResponse
   * Handles the response from the bogl API w/ the replExpression that produced it
   *
   * replExpression : Expr used to produce this response
   * response :       Encoded reponse from the API
   */
  const handleResponse = (replExpression: string, response: any) => {
    // get content from the response
    let content = extractContent(response)

    if(content["category"] === "SpielPrompt") {
      // Prompt for input
      // This is the only time we print boards that are side-effects of 'place' operations
      let respStr = ""
      if(content["boards"].length > 0 && content["boards"] instanceof Array) {
        // add all decoded boards
        respStr = filterDuplicateBoards(content["boards"].map(decodeValue)).join("") + "\n\n"
      }
      return respStr + handlePrompt(replExpression, content)

    } else if(content["category"] === "SpielTypeError") {
      // Type error
      return handleTypeError(content)

    } else if(content["category"] === "SpielParseError") {
      // Parse Error
      return handleLanguageError(content)

    } else if(content["category"] === "SpielRuntimeError") {
      // Runtime Error
      return handleRuntimeError(content)

    } else if(content["category"] === "SpielValue") {
      // BoGL value
      try {
        // attempt to decode, a bad bool value can cause an exception to throw
        return handleValue(content)

      } catch (error) {
        // handle decoding errors
        return decodeError(error, 200)

      }

    } else {
      // unrecognized category
      console.error("Invalid category in handleResponse of " + content["category"])
      throw ReferenceError("Unrecognized category. Something went wrong, please try again.")

    }
  }


  /*
   * runRepl
   * Sends execute command with input to back-end, and prints the response
   *
   * replExpression: Expression to run the Repl on
   * replPrint:      Callback function to print the response in the Repl
   */
  const runRepl = (replExpression: string, replPrint: any, requester) => {
      let respStatus = 0;

      if (inputMode) {
          // push command to input buffer
          pushToInputBuffer(replExpression);
          // use last repl expression instead
          replExpression = lastReplExpression;

      }

      // check to ':t ' to request an expression result type
      const patt = /^:t\s+/;
      if(replExpression.match(patt)) {
        // pull off the prefaced type instruction,
        // and note that we would like to report a type once done
        replExpression = replExpression.replace(patt, '');
        shouldReportExprType = true;

      }

      let pc = props.programCode;
      let pCheck = pc.replaceAll(/(?:--[^\n]*)/g,'').trim();
      if(pCheck == "") {
        // empty program, substitute a default program so we can run just expressions
        pc = "game Expressions";
      }

      // extract game name
      let gameName = extractGameNameFromProgram(pc)

      apiRequestRunCode(requester, props.preludeCode, pc, replExpression, inputBuffer, gameName)
      .then(function(res) {
        // store & decode the response
        respStatus = res.status;
        return res.json();

      }).then((result) => {
        // print the decoded response
        replPrint(handleResponse(replExpression,result));

        // always turn off type reporting as well
        shouldReportExprType = false

      }).catch((error) => {
        // print the decoded error
        replPrint(decodeError(error,respStatus))

        if(inputMode) {
          // in the case of input, assume we need to pop from the buffer to fix this
          replPrint(popFromInputBufferWithMsg())

        }

        // always turn off type reporting as well
        shouldReportExprType = false
      });

  }

  // Testing hook
  if(props.testingHook) {
    // evalute with the following expr
    const mockRequest = (a,b) => {
      return new Promise(resolve => {
        let dat = {
          status: 200,
          json: () => props.testingHook.responses
        }
        return resolve(dat)
      })
    }
    runRepl(props.testingHook.expr, props.testingHook.print, mockRequest);

    return (<></>)

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
              runRepl(expr, print, fetch);

          }}
          allowTabs={false}
          hideTopBar={true}
          startState={"maximised"}
      />

  )

}

export {Repl};
