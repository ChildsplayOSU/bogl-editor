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
let filename = "";

const Run = (props) => {

    let [gameHistory, setGameHistory] = React.useState(Array<string>());

    code = props.code;

    function parse_response(responses: any, print: any) {
        // Board
        // Value
        // Game Result
        // Parse Error
        // Type Error
        console.log(responses);
        let latest: JSON = responses[responses.length-1];
        switch (latest["tag"]) {
            case "SpielValue": {
                print(latest["contents"]["value"]);
                break;
            }
            case "SpielBoard": {
                let boardJSON: JSON = JSON.parse(latest["contents"]);
                let board: Array<Array<string>> = boardJSON["board"];
                for (let i: number = 0; i < board.length; i++) {
                    let out: string = "";
                    for (let j: number = 0; j < board[i].length; j++) {
                        if (j) {
                            out += " ";
                        }
                        out  += board[i][j];
                    }
                    print(out);
                }
                break;
            }
            // Error most likely
            default: {
                print(latest["tag"] + ": " + latest["contents"]);
            }
        }
        
    }

    function save(args: any, print: any) {
        if (args._.length != 1) {
            print("Error: Save expects only one argument: the file to be saved.");
        } else {
            filename = args._[0];
            SpielServerRequest.save(filename, code)
                .then(res => res.json())
                .then((result) => {
                    print(filename + " saved successfully!");
                }).catch((error) => {
                    print("Error: " + error);
                });
        }
        return;
    }

    function restart(print: any) {
        gameHistory = [];
        print("Restarted game successfully!");
        return;
    }

    function move(args: any, print: any) {
        let command: string = "";
        for (let i: number = 0; i < args._.length; i++) {
            if (i != 0) {
                command += " ";
            }
            command += args._[i];
        }
        gameHistory.push(command);
        console.log(filename);
        SpielServerRequest.runCmds(filename,command, [])
            .then(res => res.json())
                          .then((result) => {
                              console.log("result is", result);
                parse_response(result, print);
            }).catch((error) => {
                print("Error with compiler communications: " + error);
            });
        return;
    }
        

    return (
        <Terminal
            color='white'
            backgroundColor='black'
            barColor='black'
            style={{ fontSize: "1.1em" }}
            showActions={false}
            commands={{
                restart: {
                    method: (args, print, runCommand) => restart(print),
                },
                save: {
                    method: (args, print, runCommand) => save(args, print),
                },
                run: {
                    method: (args, print, runCommand) => move(args, print),
                },
            }}
            allowTabs={false}
            hideTopBar={true}
            startState={"maximised"}
        />
    )
}

export {Run,SpielServerRequest};
