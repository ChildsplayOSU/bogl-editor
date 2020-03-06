import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";

import SpielEditor from './Editor/SpielEditor';
import SpielNavbar from './Navbar/SpielNavbar';
import Home from './HomePage/Home';
import Tutorial from './Tutorial/Tutorial';
import Run from './Run/Run';


const App: React.FC = () => {

    let [editorTheme, setEditorTheme] = React.useState('default');
    let [runButton, setRunButton] = React.useState(false);
    let [code, setCode] = React.useState('');
    let [modalShow, setModalShow] = React.useState(false);

    // Change to Backend API
    const SPIEL_API = "https://jsonplaceholder.typicode.com/todos/1";

    function setTheme(theme: string) {
        setEditorTheme(theme);
    }

    function setRun() {
        return createBrowserHistory().location.pathname === "/free" || createBrowserHistory().location.pathname === "/tutorial";
    }

    function parse_response(res: JSON) {
        // Board
        // Value
        // Game Result
        // Parse Error
        // Type Error
    }

    function run() {
        setModalShow(true);
        fetch(
            SPIEL_API, {
                method: "GET"
        }).then(res => res.json()).then((result) => {
            console.log(result);
            parse_response(result);
        });
    }

    return (
        <>
            <Router>
                <SpielNavbar modal={run} setTheme={ setTheme } />
                <Route exact path="/" component={ Home } />
                <Route exact path="/free" render={(props) => <SpielEditor {...props} editorTheme={ editorTheme } code={ code } setCode={ setCode }/>} />
                <Route exact path="/tutorial" render={(props) => <Tutorial {...props} editorTheme={ editorTheme } />} />
            </Router>
            <Run runCode={modalShow} code={code} show={modalShow} onHide={() => setModalShow(false)}/>
        </>
    );
}

export default App;
