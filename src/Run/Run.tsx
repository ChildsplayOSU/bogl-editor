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
                fileName: fileName
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
    static runCmds(preludeFile, fileToUse, command, buf) {
        return fetch(SpielServerRequest.SPIEL_API+'/runCmds', {
            method: 'POST',
            //mode: 'no-cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prelude: preludeFile,
                file: fileToUse,
                input: command,
                buffer: buf
            }),
        })
    }
}

// Global strings to keep React state consistent (probably not best practice)
let code = "";
let command = "";
let promptSymbol = ">";
let preludePath = "Prelude.bglp"

const Run = (props) => {

    let [commandInput, setCommandInput] = useState(Array<any>());
    let [inputState, setInputState] = useState(false);

    code = props.code;

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
            } else {
                res += tuple[i]["value"].toString();
            }
        }
        res += ")";
        return res;
    }

    // Used to parse response from back-end server
    function parse_response(responses: any) {
        let latest: JSON = responses[responses.length-1];
        let res: string = "";
        let switch_mode: string = "";

        console.log(responses);
        console.log(latest);

        // Check if inputState switched
        switch (latest["tag"]) {
            case "SpielPrompt": {
                if (inputState === false) {
                    switch_mode = "\nSwitched to input mode. Type \"clear\" to go back to normal mode.\n";
                    inputState = true;
                }
                break;
            }
            case "SpielTypeError": {
                res = latest["contents"]["message"];
                return res;
            }
            case "SpielParseError": {
                console.log("PARSE ERROR FOUND: "+latest["tag"]);
                //res = latest["contents"]["message"];
                // latest["contents"][0] = LINE NUM
                // latest["contents"][1] = COLUMN NUM
                // latest["contents"][2] = FILE NAME
                // latest["contents"][3] = MESSAGE
                // extract message from 4th item
                res = "Parse Error (Typo in your file): "+latest["contents"][3];
                return res;
            }
            case "SpielTypeHole": {
                res = latest["contents"]["message"];
                return res;
            }
            default: {
                if (inputState === true) {
                    switch_mode = "\nSwitched back to normal mode.\n";
                    inputState = false;
                }
                break;
            }
        }

        // Parse response type
        switch (latest["contents"]["type"]) {
            case "Board": {
                res = get_board(latest["contents"]["value"]);
                break;
            }
            case "Tuple": {
                res = get_tuple(latest["contents"]["value"]);
                break;
            }
            default: {
                res = latest["contents"]["value"];
                break;
            }
        }

        return res + switch_mode;
    }

    // Pushes item to command's input
    function input(next: string) {
        commandInput.push({"input":next});
        return;
    }

    // Sends execute command with input to back-end, then prints out using "print"
    // function to REPL terminal
    function executeCommand(cmd: string, print: any) {
        console.log("EXECUTING: " + cmd + "/" + command);
        console.log(commandInput);
        SpielServerRequest.runCmds(preludePath, props.filename, (cmd === "" ? command : cmd), commandInput)
        .then(res => res.json())
        .then((result) => {
            print(parse_response(result));
        }).catch((error) => {
            console.log("ERROR");
            print("Error:" + error);
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
        setCommandInput([]);
        setInputState(false);
        command = "";
        //console.log(command);
        return "Exiting input mode.";
    }

    function getPromptSymbol() {
        return promptSymbol.toString();
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
                    return;
                }
                runCommand(c, print);
            }}
            allowTabs={false}
            hideTopBar={true}
            startState={"maximised"}
            promptSymbol={getPromptSymbol()}
        />

    )

}

export {Run,SpielServerRequest};
