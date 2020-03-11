import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import SpielEditor from './Editor/SpielEditor';
import SpielNavbar from './Navbar/SpielNavbar';
import Home from './HomePage/Home';
import Tutorial from './Tutorial/Tutorial';
import { Run, SpielServerRequest } from './Run/Run';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';


const App: React.FC = () => {

    // State
    let [editorTheme, setEditorTheme] = React.useState('default');
    let [code, setCode] = React.useState("");

    function setTheme(theme: string) {
        setEditorTheme(theme);
    }


    function runExample() {

        var cmds = [
            "2 + 2",
            "3 * 3",
            "20 / 4",
            "gameLoop(empty)",
            "whileTest(1)"
        ];
        SpielServerRequest.runCmds('examples/TicTacToe.bgl',cmds).then(res => res.json()).then((result) => {
            //setModalShow(true);
            var val = "";
            for(var x = 0; x < result.responses.length; x++) {
                val += cmds[x]+"\n";
                val += JSON.stringify(result.responses[x])+"\n";
            }
            setCode(val);
            //setCode(JSON.stringify(result));
        });
    }

    function updateCode(c: string) {
        setCode(c);
        console.log(code);
    }

    useEffect(() => {
        updateCode(code);
    }, [code]);

    function save(filename: string, print: any, x: string) {
        console.log(x);
        SpielServerRequest.save(filename, x)
            .then(res => res.json())
            .then((result) => {
                print(filename + " saved successfully!");
            }).catch((error) => {
                print("Error: " + error);
            });
        return;
    }


    return (
        <>
            <Router>
                <SpielNavbar setTheme={ setTheme } />
                <Row noGutters={true}>
                    <Col className="move-down tall" sm={8}>
                        <Route className="CodeMirror" exact path="/" render={(props) => <SpielEditor {...props} code={ code } editorTheme={ editorTheme } updateCode={ updateCode }/>} />
                        <Route exact path="/tutorial" render={(props) => <Tutorial {...props} editorTheme={ editorTheme } />} />
                    </Col>
                    <Col className="move-down" sm={4}>
                        <Run save={ save } code={ code }  />
                    </Col>
                </Row>
            </Router>
        </>
    );
}

export default App;
