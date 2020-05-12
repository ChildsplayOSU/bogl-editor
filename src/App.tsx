import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import SpielEditor from './Editor/SpielEditor';
import SpielNavbar from './Navbar/SpielNavbar';
import Tutorial from './Tutorial/Tutorial';
import { Run, SpielServerRequest } from './Run/Run';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';


const App: React.FC = () => {

    // Keys for local storage
    let THEME_KEY = "THEME_KEY";
    let CODE_KEY = "CODE_KEY";
    let PRELUDE_KEY = "PRELUDE_KEY";

    // State functions 
    let [editorTheme, setEditorTheme] = React.useState(localStorage.getItem(THEME_KEY) || "default");
    let [code, setCode] = React.useState(localStorage.getItem(CODE_KEY) || "");
    let [codeP, setCodeP] = React.useState(localStorage.getItem(PRELUDE_KEY) || "");

    function setTheme(theme: string) {
        setEditorTheme(theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    function updateCode(c: string) {
        setCode(c);
    }

    function updateCodeP(c: string) {
        setCodeP(c);
    }

    // Updates on change of code or filename
    useEffect(() => {
        updateCode(code);
        updateCodeP(codeP);
        localStorage.setItem(CODE_KEY, code);
        localStorage.setItem(PRELUDE_KEY, codeP);
    }, [code, codeP]);

    // Parent to Editor, Tutorial, and Run (terminal)
    return (
        <>
            <Router>
                <SpielNavbar setTheme={setTheme} />
                <Row noGutters={true}>
                    <Col className="move-down tall" sm={8}>
			<Route className="CodeMirror" exact path="/" render={(props) => 
                            <Tabs defaultActiveKey="Code" transition={false} id="uncontrolled-tab-example">
                                <Tab hidden={false} eventKey="Code" title="Code">
                                    <SpielEditor {...props} code={code} editorTheme={editorTheme} updateCode={updateCode}/>
                                </Tab>
                                <Tab hidden={false} eventKey="Prelude" title="Prelude">
                                    <SpielEditor {...props} code={codeP} editorTheme={editorTheme} updateCode={updateCodeP}/>
                                </Tab>
                            </Tabs>
                        } />
                        <Route exact path="/tutorial" render={(props) => <Tutorial {...props} editorTheme={editorTheme} />} />
                    </Col>
                    <Col className="move-down tall" sm={4}>
                        <Run code={code} codeP={codeP} />
                    </Col>
                </Row>
            </Router>
        </>
    );
}

export default App;
