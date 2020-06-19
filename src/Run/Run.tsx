import React, { useState, useEffect } from 'react';
// import Form from 'react-bootstrap/Form';
import Terminal from 'terminal-in-react';

// Class for representing requests
// that can be made to the BoGL Server
class SpielServerRequest {

    // Change to Backend API
    static SPIEL_API = "/api_1";


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

    // Used to parse response from back-end server
    function parse_response(responses: any) {
        let latest: JSON = responses[responses.length-1];
        let res: string = "";
        let switch_mode: string = "";
        let boards: string = "";
        console.log(responses);
        console.log(latest);

        // Check if inputState switched
        switch (latest["tag"]) {
            case "SpielPrompt": {
                if (inputState === false) {
                    switch_mode = "\nSwitched to input mode. Type \"clear\" to go back to normal mode.\n";
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
                // Else it's a SpielValue
                if (inputState === true) {
                    switch_mode = "\nSwitched back to normal mode.\n";
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
        console.log("EXECUTING: " + cmd + "/" + command);
        SpielServerRequest.runCode(codeP, code, (cmd === "" ? command : cmd), commandInput)
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
