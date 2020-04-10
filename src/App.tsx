import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import SpielEditor from './Editor/SpielEditor';
import {SpielNavbarNative, SpielNavbar} from './Navbar/SpielNavbar';
import Tutorial from './Tutorial/Tutorial';
import { Run, SpielServerRequest } from './Run/Run';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const {Menu, dialog} = window.require("electron").remote;

const App: React.FC = () => {

    // Keys for local storage
    let THEME_KEY = "THEME_KEY";
    let CODE_KEY = "CODE_KEY";
    let FILE_KEY = "FILE_KEY";

    // State functions 
    let [editorTheme, setEditorTheme] = React.useState(localStorage.getItem(THEME_KEY) || "default");
    let [code, setCode] = React.useState(localStorage.getItem(CODE_KEY) || "");
    let [filename, setFilename] = React.useState(localStorage.getItem(FILE_KEY) || "");

    function setTheme(theme: string) {
        setEditorTheme(theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    function updateCode(c: string) {
        setCode(c);
    }

    // Updates on change of code or filename
    useEffect(() => {
        updateCode(code);
        localStorage.setItem(CODE_KEY, code);
    }, [code]);

    // Save function: saves file, sets filename to be run, and  
    function save(fn) {
        localStorage.setItem(FILE_KEY, filename);
        SpielServerRequest.save(fn, code)
                          .then(res => res.json()).then((result) => {
                              console.log("saved: " + fn);
                              console.log(result);
                          }).catch((error) => alert("Error connecting with server: " + error));
        return;
    }

    // Load function: loads file from back end
    function load(fn) {
        SpielServerRequest.read(fn)
                          .then(res => res.json()).then((result) => {
                              console.log("loaded: " + filename);
                              setCode(result["content"]);
                              setFilename(result["fileName"]);
                          }).catch((error) => alert("Error: Please make sure that the filename is correct (" + error + ")"));
        return;
    }
    let props = {load: load, filename: filename, setFilename: setFilename, save: save}
    const menu = Menu.buildFromTemplate(SpielNavbarNative(props))
    Menu.setApplicationMenu(menu)

    // Parent to Editor, Tutorial, and Run (terminal)
    return (
        <>
            <Router>
                <Row noGutters={true}>
                    <SpielNavbar load={load} filename={filename} setFilename={setFilename} save={save} setTheme={setTheme} />
                    <Col className="move-down tall" sm={8}>
                        <Route className="CodeMirror" exact path="/" render={(props) => <SpielEditor {...props} code={code} editorTheme={editorTheme} updateCode={updateCode}/> } />
                        <Route exact path="/tutorial" render={(props) => <Tutorial {...props} editorTheme={editorTheme} />} />
                    </Col>
                    <Col className="move-down tall" sm={4}>
                        <Run code={code} filename={filename} />
                    </Col>
                </Row>
            </Router>
        </>
    );
}

export default App;
