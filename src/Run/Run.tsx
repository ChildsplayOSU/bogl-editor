import React, { useState, useEffect } from 'react';
// import Form from 'react-bootstrap/Form';
import Terminal from 'terminal-in-react';

// Class for representing requests
// that can be made to the BoGL Server
class SpielServerRequest {

    // Change to Backend API
    static SPIEL_API = "/api_1";


    // Access the test endpoint, checks if the server is online
    static test() {
      return fetch(SpielServerRequest.SPIEL_API+'/test', {method: 'GET'});
    }


    // Saves contents to a given filename
    static share(preludeContent, gamefileContent) {
      return fetch(SpielServerRequest.SPIEL_API+'/share', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              preludeContent: preludeContent,
              gameContent: gamefileContent
          })
      });
    }


    // Used to load up both a prelude & gamefile simultaneously
    static load(id) {
      return fetch(SpielServerRequest.SPIEL_API+'/load', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              fileName: id
          })
      });
    }


    // Reads a file by the given name
    static read(filename) {
      return fetch(SpielServerRequest.SPIEL_API+'/read', {
          method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              path: filename
          })
      });
    }


    // Runs a command on a given prelude and gamefile contents, with input as well
    static runCode(prelude_code, code, command, buf) {
        return fetch(SpielServerRequest.SPIEL_API+'/runCode', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prelude: prelude_code,
                file: code,
                input: command,
                buffer: buf
            }),
        })
    }
}

// Global strings to keep React state consistent (probably not best practice)
let code = "";
let codeP = "";
let command = "";

const Run = (props) => {

    let [commandInput, setCommandInput] = useState(Array<any>());
    let [inputState, setInputState] = useState(false);

    code = props.code;
    codeP = props.codeP;

    // Build board from JSON
    function get_board(board: Array<Array<JSON>>) {
        let res: string = "";
        for (let i: number = 0; i < board.length; i++) {
            for (let j: number = 0; j < board[i].length; j++) {
                if (j) {
                    res += "\t";
                }
                res += board[i][j][1]["value"];
            }
            res += "\n";
        }
        return res;
    }

    // We support nested tuples, so recursion is our friend
    function get_tuple(tuple: any) {
        let res: string = "(";
        for (let i: number = 0; i < tuple.length; i++) {
            if (i > 0) {
                res += ",";
            }
            if (tuple[i]["type"] === "Tuple") {
                res += "(" + get_tuple(tuple[i]["value"]) + ")";
            }
            else if (tuple[i]["type"] === "Board") {
                res += "\n\n";
                res += get_board(tuple[i]["value"]);
                res += "\n";
            }
            else
            {
                res += tuple[i]["value"].toString();
            }
        }
        res += ")";
        return res;
    }

    // Used to stop handling input
    // Used after input has been accepted to full
    // or 'clear' has been typed
    function exitInputHandling() {
      setCommandInput([]);
      setInputState(false);
      command = "";
    }

    // Used to parse response from back-end server
    function parse_response(responses: any) {
        let latest: JSON = responses[responses.length-1];
        let res: string = "";
        let switch_mode: string = "";
        let boards: string = "";
        //console.log(responses);
        //console.log(latest);

        // Check if inputState switched
        switch (latest["tag"]) {
            case "SpielPrompt": {
                if (inputState === false) {
                    switch_mode = "\n[ 🤖 BoGL Says: Enter input, or \"clear\" to stop. ]\n";
                    inputState = true;
                }
                latest["contents"].forEach(b => boards = boards + get_board(b["value"]) + "\n");
                return boards + switch_mode;
            }
            case "SpielTypeError": {
                res = latest["contents"]["message"];
                return res;
            }
            case "SpielParseError": {
                console.log("Language (Parse) Error Found: "+latest["tag"]);
                //res = latest["contents"]["message"];
                // latest["contents"][0] = LINE NUM
                // latest["contents"][1] = COLUMN NUM
                // latest["contents"][2] = FILE NAME
                // latest["contents"][3] = MESSAGE
                // extract message from 4th item
                res = "Language Error: "+latest["contents"][3];
                return res;
            }
            case "SpielRuntimeError": {
              console.log("Runtime error encountered: "+ latest["contents"]);
              res = "Runtime Error: "+latest["contents"];
              if(inputState === true) {
                // flush cmd buffer so a retry will work,
                commandInput = [];
                res += "\nYou entered an expression of incorrect type. Please enter an expression of the correct type.";
              }
              return res;
            }
            case "SpielTypeHole": {
                res = latest["contents"]["message"];
                return res;
            }
            default: {
                // Else it's a SpielValue
                if (inputState === true) {
                    switch_mode = "\n[ 🤖 BoGL Says: Done reading input. ]\n";
                    exitInputHandling();
                    inputState = false;
                }
                break;
            }
        }

        // Parse response type
        switch (latest["contents"][1]["type"]) {
            case "Board": {
                res = get_board(latest["contents"][1]["value"]);
                break;
            }
            case "Tuple": {
                res = get_tuple(latest["contents"][1]["value"]);
                break;
            }
            default: {
                res = latest["contents"][1]["value"];
                break;
            }
        }

        latest["contents"][0].forEach(b => extendBoardsString(b, res, boards));
        return boards + res + switch_mode;
    }

    // an expression like place(1,b,(1,1)) evaluates to a board and it also adds the same board to
    // the print buffer. This makes sure we do not print duplicate boards.
    // an expression could modify two boards to be identical, in that case it may be confusing to
    // only print one board, but that is a much less common use case that the first one.
    function extendBoardsString(board, value, boards) {
        var boardStr = get_board(board["value"]);
        if (boardStr != value) boards = boards + boardStr + value + "\n";
    }

    // Pushes item to command's input
    function input(next: string) {
        commandInput.push({"input":next});
        return;
    }

    // Sends execute command with input to back-end, then prints out using "print"
    // function to REPL terminal
    function executeCommand(cmd: string, print: any) {
        let respStatus = 0;

        console.dir(inputState);
        console.dir((cmd === "" ? command : cmd));
        console.dir(commandInput);


        SpielServerRequest.runCode(codeP, code, (cmd === "" ? command : cmd), commandInput)
        .then(function(res) {
          // decode this response
          //console.dir(res);
          respStatus = res.status;
          return res.json();

        }).then((result) => {
          // valid response to print
          print(parse_response(result));

        }).catch((error) => {
          if((error instanceof SyntaxError || (error.name && error.name == "SyntaxError")) && respStatus == 504) {
            // gateway timeout
            //console.dir(error);
            print("[ 🤖 BoGL Says: Unable to finish running your program, or not currently online. Double check your code, or check back later! ]");

          } else if((error instanceof SyntaxError || (error.name && error.name == "SyntaxError"))) {
            // bad parse error
            //console.dir(error);
            print("[ 🤖 BoGL Says: Your program was unable to be understood. Please double check it and try again! ]");

          } else if((error instanceof TypeError || (error.name && error.name == "TypeError")) && respStatus == 0) {
            // likely JS disabled
            //console.dir(error);
            print("[ 🤖 BoGL Says: Unable to execute your program. Make sure that Javascript is enabled and try again! ]");

          } else if((error instanceof TypeError || (error.name && error.name == "TypeError"))) {
            // something else?
            //console.dir(error);
            print("[ 🤖 BoGL Says: Unable to execute your program, please double check your code and try again. ]");

          } else {
            // general error
            //console.dir(error);
            print("[ 🤖 BoGL Says: An error occurred: " + error + " ]");

          }
        });
    }

    // Run REPL command. If expecting input, put input in
    function runCommand(cmd: string, print: any) {
        if (inputState) {
            input(cmd);
            return executeCommand("", print);
        } else {
            command = cmd;
            return executeCommand(cmd, print);
        }
    }

    // Clear input and state
    function clear() {
        exitInputHandling();
        return "[ 🤖 BoGL Says: Ok, skipping input. ]";
    }

    return (
        <Terminal
            color='white'
            backgroundColor='black'
            barColor='black'
            style={{ fontSize: "1.1em" }}
            showActions={false}
            commands={{
                "clear": () => clear(),
            }}
            commandPassThrough={(cmd, print) => {
                // Build command (cmd == array of arguments user entered with spaces separated)
                let c = "";
                for (var x = 0; x < cmd.length; x++) {
                    if (x) {
                        c += " ";
                    }
                    c += cmd[x];
                }
                if (c === "clear") {
                    clear();
                    return;
                }
                runCommand(c, print);
            }}
            allowTabs={false}
            hideTopBar={true}
            startState={"maximised"}
        />

    )

}

export {Run,SpielServerRequest};
