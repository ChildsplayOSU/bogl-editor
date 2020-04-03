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

    function updateCode(c: string) {
        setCode(c);
    }

    useEffect(() => {
        updateCode(code);
    }, [code]);

    // Hard-coded filename: TEMP.bgl, saves file
    function save() {
        SpielServerRequest.save("TEMP",code)
        .then(res => res.json()).then((result) => { 
            console.log("saved"); 
            console.log(result); 
        }).catch((error) => alert("Error: " + error));
        return;
    }

    return (
        <>
            <Router>
                <SpielNavbar run={ save } setTheme={ setTheme } />
                <Row noGutters={true}>
                    <Col className="move-down tall" sm={8}>
                        <Route className="CodeMirror" exact path="/" render={(props) => <SpielEditor {...props} code={ code } editorTheme={ editorTheme } updateCode={ updateCode }/>} />
                        <Route exact path="/tutorial" render={(props) => <Tutorial {...props} editorTheme={ editorTheme } />} />
                    </Col>
                    <Col className="move-down tall" sm={4}>
                        <Run code={ code }  />
                    </Col>
                </Row>
            </Router>
        </>
    );
}

export default App;
