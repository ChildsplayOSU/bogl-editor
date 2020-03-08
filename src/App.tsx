import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";

import SpielEditor from './Editor/SpielEditor';
import SpielNavbar from './Navbar/SpielNavbar';
import Home from './HomePage/Home';
import Tutorial from './Tutorial/Tutorial';
import { Run, SpielServerRequest } from './Run/Run';


const App: React.FC = () => {

    // State
    let [editorTheme, setEditorTheme] = React.useState('default');
    let [runButton, setRunButton] = React.useState(false);
    let [code, setCode] = React.useState('');
    let [modalShow, setModalShow] = React.useState(false);

    function setTheme(theme: string) {
        setEditorTheme(theme);
    }

    function setRun() {
        return createBrowserHistory().location.pathname === "/free" || createBrowserHistory().location.pathname === "/tutorial";
    }

    // just a placeholder to run a file on the backend
    // save a file with a given name of TEMP
    // run that file
    function runExample() {

        // /read
        // read a file, auto-adds .bgl extension
        // returns JSON with 'content' and 'fileName' set
        // returns...{"fileName":"examples/TicTacToe","content":"..."}
        /*
        SpielServerRequest.read('examples/TicTacToe').then(res => res.json()).then(result => {
            setCode(JSON.stringify(result));
            //setCode(result.content);
        });

        // /save
        // save a file with data
        // auto-adds the '.bgl' extension, so leave it off
        // to prevent accidentally overwriting a .hs file or something other than a .bgl file
        // returns...{"responses":[{"tag":"SpielOK","contents":"TEST.bgl written successfully"}]}
        
        SpielServerRequest.save('TEST',"2 + 2 * 3").then(res => res.json()).then(result => {
            setCode(JSON.stringify(result));
        });

        // /test
        // example of calling test endpoint, just to make sure it's working
        // returns...{"responses":[{"tag":"SpielOK","contents":"Spiel is Running!"}]}
        SpielServerRequest.test().then(res => res.json()).then(result => {
            setCode(JSON.stringify(result));
        });

        // /runCmds
        // example of running commands on a file
        /**/
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

    function runButtonClicked() {
        setModalShow(true);         
    }

    function runCode() {
        console.log("run button clicked");
    }

    return (
        <>
            <Router>
                <SpielNavbar modal={runButtonClicked} setTheme={ setTheme } />
                <Route exact path="/" component={ Home } />
                <Route exact path="/free" render={(props) => <SpielEditor {...props} editorTheme={ editorTheme } code={ code } setCode={ setCode }/>} />
                <Route exact path="/tutorial" render={(props) => <Tutorial {...props} editorTheme={ editorTheme } />} />
            </Router>
            <Run runCode={runCode} code={code} show={modalShow} onHide={() => setModalShow(false)}/>
        </>
    );
}

export default App;
