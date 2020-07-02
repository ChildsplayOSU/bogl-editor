import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
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
    let LOAD_KEY = "LOAD_KEY";

    // State functions
    let [editorTheme, setEditorTheme] = React.useState(localStorage.getItem(THEME_KEY) || "default");
    let [code, setCode] = React.useState(localStorage.getItem(CODE_KEY) || "");
    let [codeP, setCodeP] = React.useState(localStorage.getItem(PRELUDE_KEY) || "");
    let [shareLink, setShareLink] = React.useState(false);
    let [P, setP] = React.useState(false);

    // checks to load a gamefile & prelude
    function checkToLoad() {
      // pull out params
      const url = window.location.search;
      let params = queryString.parse(url);

      if(params.p) {
        // prelude & gamefile given
        // load up prelude & gamefile code
        SpielServerRequest.load(params.p).then(function(resp) {
          return resp.json();

        }).then(function(result) {
          // load in prelude & gamefile
          if(result.tag == "SpielLoadResult") {
            // good
            setCodeP(result.contents[0]);

            // TODO can uncomment to implement game file changing as well
            //setCode(result.contents[1]);
            //localStorage.setItem(CODE_KEY, result.contents[1]);

            localStorage.setItem(PRELUDE_KEY, result.contents[0]);

            // redirect to '/' to avoid changes later on
            window.location.href = '/';

          } else {
            //console.dir(result);
            console.error("Error: "+result.contents);
            alert("Couldn't load in prelude and gamefile!");
          }

        }).catch(function(err) {
          // unable to load
          //console.dir(err);
          alert("Unable to load specific prelude and gamefile! Using what you last had.");

        })
      }
    }

    function setTheme(theme: string) {
        setEditorTheme(theme);
        localStorage.setItem(THEME_KEY, theme);
    }

    // shares the prelude and gamefile of this user
    // returns a string to share
    function sharePrelude() {
      // request to share prelude & gamefile, will return a unique filename on success, otherwise failure
      return SpielServerRequest.share(codeP, code).then(function(resp) {
        return resp.json();
      });
    }

    function updateCode(c: string) {
        setCode(c);
    }

    function updateCodeP(c: string) {
        setCodeP(c);
    }

    function getShareLink() {
      return shareLink;
    }

    // Updates on change of code or filename
    useEffect(() => {
        updateCode(code);
        updateCodeP(codeP);
        localStorage.setItem(CODE_KEY, code);
        localStorage.setItem(PRELUDE_KEY, codeP);
        checkToLoad();
    }, [code, codeP, P]);

    // Set prelude code or regular code to be displayed
    function go(k: string) {
        setP(k == "Prelude");
    }

    // Parent to Editor, Tutorial, and Run (terminal)
    return (
        <>
            <Router>
                <SpielNavbar setTheme={setTheme} setCode={setCode} sharePrelude={sharePrelude} setShareLink={setShareLink} getShareLink={getShareLink}/>
                <Row noGutters={true}>
                    <Col className="move-down tall" sm={8}>
			<Route className="CodeMirror" exact path="/" render={(props) =>
                            <>
                                <Tabs defaultActiveKey="Code" transition={false} id="uncontrolled-tab-example" onSelect={(k) => go(k)}>
                                    <Tab eventKey="Code" title="Code"></Tab>
                                    <Tab eventKey="Prelude" title="Prelude"></Tab>
                                </Tabs>
                                <SpielEditor {...props} code={(P ? codeP : code)} editorTheme={editorTheme} updateCode={(P ? updateCodeP : updateCode)}/>
                            </>
                        } />
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
