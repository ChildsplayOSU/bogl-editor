import React, { useEffect } from 'react';
import queryString from 'query-string';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route } from "react-router-dom";

import SpielEditor from './Editor/SpielEditor';
import SpielNavbar from './Navbar/SpielNavbar';
import { Repl } from './Repl/Repl';
import { apiRequestShare, apiRequestLoad } from './Utilities/BoGLServerRequest';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

const App: React.FC = () => {

    // Keys for local storage
    let THEME_KEY   = "THEME_KEY";
    let CODE_KEY    = "CODE_KEY";
    let PRELUDE_KEY = "PRELUDE_KEY";
    let SHARE_KEY   = "SHARE_KEY";

    // State functions
    let [editorTheme, setEditorTheme] = React.useState(localStorage.getItem(THEME_KEY) || "default");
    let [programCode, setProgramCode] = React.useState(localStorage.getItem(CODE_KEY) || "");
    let [preludeCode, setPreludeCode] = React.useState(localStorage.getItem(PRELUDE_KEY) || "");
    let [madeChanges, setMadeChanges] = React.useState(false);
    let [shareLoaded, setShareLoaded] = React.useState(localStorage.getItem(SHARE_KEY) || "");
    let [shareLink, setShareLink] = React.useState(false);

    // indicates whether program or prelude is displayed, default is false to display program
    let [displayPrelude, setDisplayPrelude] = React.useState(false);


    // update the prelude used in the Editor
    function updatePreludeContent(content: string) {
      // mark that changes were made
      setMadeChanges(true);
      // update prelude locally & in state
      setPreludeCode(content);
      localStorage.setItem(PRELUDE_KEY, content);
    }


    // update the programCode used in the Editor
    function updateCodeContent(content: string) {
      // mark that changes were made
      setMadeChanges(true);
      // update code locally & in state
      setProgramCode(content);
      localStorage.setItem(CODE_KEY, content);
    }

    // loads new code from a share link
    function performLoad() {

      const url = window.location.search;
      let params = queryString.parse(url);

      apiRequestLoad(fetch, params.p).then(function(resp) {
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
            // program only
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


    // checks to load a gamefile & prelude
    function checkToLoad() {
      // pull out params
      const url = window.location.search;
      let params = queryString.parse(url);

      if(params.p && params.s && shareLoaded !== params.p) {
        // code & share option given
        // load up prelude & gamefile code
        performLoad();

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
      return apiRequestShare(fetch, preludeCode, programCode).then(function(resp) {
        return resp.json();
      });
    }

    function updateCodeProgram(c: string) {
        setProgramCode(c);
    }

    function updateCodePrelude(c: string) {
        setPreludeCode(c);
    }

    function getShareLink() {
      return shareLink;
    }

    // Updates on change of code or filename
    useEffect(() => {
        updateCodeContent(programCode);
        updatePreludeContent(preludeCode);
        checkToLoad();
        // (complains about CODE_KEY, PRELUDE_KEY, and checkToLoad, which are all present already)
        // eslint-disable-next-line
    }, [programCode, preludeCode, displayPrelude]);

    // Set prelude or program to be displayed
    function toggleTabDisplay(tabKey: string) {
        setDisplayPrelude(tabKey === "Prelude");
    }

    // Parent to Editor and Repl (terminal)
    return (
        <>
            <Router>
                <SpielNavbar downloadAsProgram={!displayPrelude} setTheme={setTheme} setProgramCode={setProgramCode} lastCode={programCode} madeChanges={madeChanges} setMadeChanges={setMadeChanges} lastPrelude={preludeCode} sharePrelude={sharePrelude} setShareLink={setShareLink} getShareLink={getShareLink} reset={performLoad}/>
                <Row noGutters={true}>
                    <Col className="move-down tall" sm={8}>
			                 <Route className="CodeMirror" exact path="/" render={(props) =>
                            <>
                                <Tabs defaultActiveKey="Program" transition={false} id="uncontrolled-tab-example" onSelect={toggleTabDisplay}>
                                    <Tab eventKey="Program" title="Program"></Tab>
                                    <Tab eventKey="Prelude" title="Prelude"></Tab>
                                </Tabs>
                                <SpielEditor {...props} code={(displayPrelude ? preludeCode : programCode)} editorTheme={editorTheme} updateCode={(displayPrelude ? updateCodePrelude : updateCodeProgram)}/>
                            </>
                        } />
                    </Col>
                    <Col className="move-down tall" sm={4}>
                        <Repl programCode={programCode} preludeCode={preludeCode} />
                    </Col>
                </Row>
            </Router>
        </>
    );
}

export default App;
