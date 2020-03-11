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
    static runCmds(fileToUse,commands) {
        return fetch(SpielServerRequest.SPIEL_API+'/runCmds', {
            method: 'POST',
            //mode: 'no-cors',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                file: fileToUse,
                inputs: commands,
            }),
        })
    }


    static parse_response(res: JSON) {
        // TODO needs to be implmeneted
        // Board
        // Value
        // Game Result
        // Parse Error
        // Type Error
    }

}

let code = "";

const Run = (props) => {

    let [gameHistory, setGameHistory] = React.useState([]);
    let [filename, setFileName] = React.useState("");

    code = props.code;

    function save(args, print) {
        if (args._.length != 1) {
            print("Error: Save expects only one argument: the file to be saved.");
        } else {
            let filename: string = args._[0];
            //console.log(code);
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

    return (
        <Terminal
            color='white'
            backgroundColor='black'
            barColor='black'
            style={{ fontSize: "1.1em" }}
            showActions={false}
            commands={{
                save: {
                    method: (args, print, runCommand) => save(args, print),
                    options: [
                        {
                            name: 'file',
                            description: 'File to be run',
                            defaultValue: '',
                        },
                    ],
                },
            }}
        />
    )
}

export {Run,SpielServerRequest};
