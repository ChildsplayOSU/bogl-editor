import React, { useEffect } from 'react';
import queryString from 'query-string';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from "react-router-dom";

import SpielEditor from './Editor/SpielEditor';
import SpielNavbar from './Navbar/SpielNavbar';
import { Run, SpielServerRequest } from './Run/Run';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

const App: React.FC = () => {

    // Keys for local storage
    let THEME_KEY = "THEME_KEY";
    let CODE_KEY = "CODE_KEY";
    let PRELUDE_KEY = "PRELUDE_KEY";
    let SHARE_KEY = "SHARE_KEY";

    // State functions
    let [editorTheme, setEditorTheme] = React.useState(localStorage.getItem(THEME_KEY) || "default");
    let [code, setCode] = React.useState(localStorage.getItem(CODE_KEY) || "");
    let [codeP, setCodeP] = React.useState(localStorage.getItem(PRELUDE_KEY) || "");
    let [shareLoaded, setShareLoaded] = React.useState(localStorage.getItem(SHARE_KEY) || "");
    let [shareLink, setShareLink] = React.useState(false);
    let [P, setP] = React.useState(false);


    // update the prelude used in the Editor
    function updatePreludeContent(content: string) {
      setCodeP(content);
      localStorage.setItem(PRELUDE_KEY, content);
    }


    // update the code used in the Editor
    function updateCodeContent(content: string) {
      setCode(content);
      localStorage.setItem(CODE_KEY, content);
    }


    // checks to load a gamefile & prelude
    function checkToLoad() {
      // pull out params
      const url = window.location.search;
      let params = queryString.parse(url);

      if(params.p && params.s && shareLoaded !== params.p) {
        // code & share option given
        // load up prelude & gamefile code
        SpielServerRequest.load(params.p).then(function(resp) {
          return resp.json();
        }).then(function(result) {

          let shareOption = parseInt(params.s);

          // load in prelude & gamefile
          if(result.tag === "SpielLoadResult") {
            // good, now load based on share option
            if(shareOption === 0) {
              // prelude only
              updatePreludeContent(result.contents[0]);

            } else if(shareOption === 1) {
              // code only
              updateCodeContent(result.contents[1]);

            } else if(shareOption === 2) {
              // both
              updatePreludeContent(result.contents[0]);
              updateCodeContent(result.contents[1]);

            } else {
              // bad share option
              console.warn("The share option code provided was unrecognized: "+params.s);
              alert("Invalid share option given: "+ params.s);

            }

            // update that this share has been loaded, so we don't need to reload it again
            setShareLoaded(params.p);
            localStorage.setItem(SHARE_KEY, params.p);

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
        updateCodeContent(code);
        updatePreludeContent(codeP);
        checkToLoad();
        // (complains about CODE_KEY, PRELUDE_KEY, and checkToLoad, which are all present already)
        // eslint-disable-next-line
    }, [code, codeP, P]);

    // Set prelude code or regular code to be displayed
    function go(k: string) {
        setP(k === "Prelude");
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
