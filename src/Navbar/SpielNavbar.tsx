import * as React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Share from './Share';
import Download from './Download';
import queryString from 'query-string';
import { Icon } from 'react-icons-kit'
import {shareAlt} from 'react-icons-kit/fa/shareAlt'
import {undo} from 'react-icons-kit/fa/undo'
import {extractGameNameFromProgram} from '../Utilities/ProgramUtils'

import './SpielNavbar.css';

const SpielNavbar = (props) => {

    let [didShare, setDidShare] = React.useState(false);

    // Themes available
    const themes: Array<string> = ["default", "midnight", "gruvbox-dark", "solarized", "nord"];

    // Generate theme list to be used in drop down
    function getThemes() {
        let navitems: Array<JSX.Element> = [];
        for (let i = 0; i < themes.length; i++) {
            navitems.push(<NavDropdown.Item key={i} onClick={() => props.setTheme(themes[i]) }>{ themes[i] }</NavDropdown.Item>);
        }
        return navitems;
    }


    function getShareOption() {

      // verify changes haven't been made
      if(props.madeChanges) {
        // share is out of date, need to reshare the new code
        didShare = false;

      }

      let items: Array<JSX.Element> = [];

      if(didShare) {
        // show share link for convenience
        //return <Share shareLink={props.getShareLink()}/>;
        items.push(<Share shareLink={props.getShareLink()}/>);

      }

      let fileName = props.downloadAsProgram ? extractGameNameFromProgram(props.lastCode) + ".bgl.txt" : "Prelude.bgl.txt";
      let content = props.downloadAsProgram ? props.lastCode : props.lastPrelude;

      items.push(<Download key="downloadLink" content={content} link={fileName}/>);

      // parse out the params from the url
      const url = window.location.search;
      let params = queryString.parse(url);

      // reset button (if viewing shared file)
      if(params.p && params.s) {
        // viewing a shared file, show a 'Reset button for it'
        items.push(<Button key="resetButton" variant="outline-light" title="Reset your BoGL program to what was shared" type="button" onClick={(e) => props.reset()} className="right-padd"><Icon icon={undo}/></Button>);

      }

      // share button
      items.push(<Button key="shareButton" variant="outline-light" title="Share your BoGL program" type="button" onClick={(e) => props.sharePrelude().then(function(result) {
        if(result[0].tag === "SpielSuccess") {
          // update that we shared
          setDidShare(true);

          // indicate we have not made changes since our last share
          // when code or prelude is updated, App.tsx will mark that changes have been made,
          // and this will invalidate the share link (as it will be outdated, and should be regenerated)
          props.setMadeChanges(false);

          // update with the new link
          props.setShareLink(result[0].contents);
          // the copy will be implicitly done by the above item ^^ (Share.tsx)

        } else {
          alert("Unable to share!");

        }

      }).catch(function(err) {
        alert("Failed to share!");

      })}><Icon icon={shareAlt}/></Button>);

      return items;

    }

    // Uses React-Router to change page
    return (
        <Navbar bg="danger" variant="dark" expand="lg" fixed="top">
            <Navbar.Brand><img src="favicon.ico" className="icon" width="26" height="26" alt="BoGL Logo"/> BoGL: Board Game Language</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">

                    <NavDropdown title="Themes" id="basic-nav-dropdown" className="align-navlink">
                        {getThemes()}
                    </NavDropdown>

                    <Nav.Link className="align-navlink" href="/tutorials/">
                        Tutorials
                    </Nav.Link>

                    <Nav.Link className="align-navlink" href="/tutorials/GettingStarted">
                        Getting Started
                    </Nav.Link>

                </Nav>
                <Form inline>
                  {getShareOption()}
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default SpielNavbar;
