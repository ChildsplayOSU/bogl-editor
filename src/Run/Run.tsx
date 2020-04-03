import React, { useState, useEffect } from 'react';
// import Form from 'react-bootstrap/Form';
import Terminal from 'terminal-in-react';


// Class for representing requests
// that can be made to the Spiel Language Server
class SpielServerRequest {

    // Change to Backend API
    static SPIEL_API = "http://localhost:8080";


    // creates a new file with the given content
    // automatically adds '.bgl' to whatever the name is
    // so 'TEST' will be 'TEST.bgl' serverside
    // (to protect overwriting existing non-bgl files)
    static save(fileName,content) {
        return fetch(SpielServerRequest.SPIEL_API+'/save', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fileName: fileName,
                content: content,
            }),
        });
    }

    static read(fileName) {
        return fetch(SpielServerRequest.SPIEL_API+'/read', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: fileName
            }),
        });
    }


    // requests the test endpoint,
    // just to make sure things are working
    static test() {
        return fetch(
            SpielServerRequest.SPIEL_API+"/test", {
                method: "GET"
            });
    }


    // "examples/TicTacToe.bgl"
    // ["2 + 2","3 * 3","20 / 4"]
    // Runs a file with the given commands
    static runCmds(fileToUse, command, buf) {
        return fetch(SpielServerRequest.SPIEL_API+'/runCmds', {
            method: 'POST',
            //mode: 'no-cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file: fileToUse,
                input: command,
                buffer: buf
            }),
        })
    }
}

let code = "";
let filename = "TEMP";

const Run = (props) => {

    let [commandInput, setCommandInput] = React.useState(Array<any>());
    let [command, setCommand] = React.useState(""); 
    let [inputState, setInputState] = React.useState(false);

    code = props.code;

    function parse_response(responses: any) {
        // Board
        // Value
        // Game Result
        // Parse Error
        // Type Error
        console.log(responses);
        let latest: JSON = responses[responses.length-1];
        let res: string = "";
        switch (latest["tag"]) {
            case "SpielValue": {
                res = latest["contents"]["value"].toString();
                break;
            }
            case "SpielBoard": {
                let boardJSON: JSON = JSON.parse(latest["contents"]);
                let board: Array<Array<string>> = boardJSON["board"];
                for (let i: number = 0; i < board.length; i++) {
                    for (let j: number = 0; j < board[i].length; j++) {
                        if (j) {
                            res += "\t";
                        }
                        res += board[i][j];
                    }
                    res += "\n";
                }
                break;
            }
            case "SpielPrompt": {
                let boardJSON: JSON = latest["contents"];
                //console.log("boardJSON: ", boardJSON);
                let board: Array<Array<JSON>> = boardJSON[0]["value"];
                //console.log("board: ", board);
                for (let i: number = 0; i < board.length; i++) {
                    for (let j: number = 0; j < board[i].length; j++) {
                        if (j) {
                            res += "\t";
                        }
                        res += board[i][j][1]["value"];
                    }
                    res += "\n";
                }
                break;
            }
            case "SpielTypeError": {
                let contents = latest["contents"];

                // unused vars but I left them here in case we want to highlight in the editor
                let line = contents["line"];
                let column = contents["col"];
                // print(contents["message"]);
                break;
            }
            case "SpielParseError": {
                print(latest["tag"] + ": " + latest["contents"]); 
                break; 
            }
            // Error most likely
            default: {
                print(latest["tag"] + ": " + latest["contents"]); 
                break;  
            }
        }
        return res;
    }

    function restart() {
        commandInput = [];
        return;
    }


    function input(next: string) {
        commandInput.push(next);
        return;
    }

    function executeCommand(cmd: string) {
        console.log("EXECUTING: " + cmd);
        console.log(commandInput);
        SpielServerRequest.runCmds(filename, cmd == "" ? command : cmd, commandInput)
        .then(res => res.json())
        .then((result) => {
            return parse_response(result);
        }).catch((error) => {
            console.log("ERROR"); 
            return "error";
        });
    }

    function runCommand(cmd: string) {
        if (inputState) {
            input(cmd);
            return executeCommand("");
        } else {
            setInputState(true);
            setCommand(cmd);
            restart();
            return executeCommand(cmd);
        }
    }

    return (
        <Terminal
            color='white'
            backgroundColor='black'
            barColor='black'
            style={{ fontSize: "1.1em" }}
            showActions={false}
            commandPassThrough={(cmd, print) => {
                // Expects to return string to be printed
                let res = runCommand(cmd);
                return res;
            }}
            allowTabs={false}
            hideTopBar={true}
            startState={"maximised"}
        />

    )

}

export {Run,SpielServerRequest};
