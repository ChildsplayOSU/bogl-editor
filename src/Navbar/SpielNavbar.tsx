import * as React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BrowserRouter as NavLink, Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import './SpielNavbar.css';

const SpielNavbar = (props) => {

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

    // When users press enter to submit save request, automatically reloads page
    function handleSubmit(e: any) {
        // This disables reload
        e.preventDefault();
        props.save();
    }

    function getShareOption() {
      if(props.getShareLink() != "") {
        // share link is set
        return <Form.Control type="email" value={window.location.href + "?p=" + props.getShareLink()}/>

      } else {
        // share link has not been generated yet
        return <Button variant="outline-light" title="Generates share link for Prelude" type="button" onClick={() => props.sharePrelude().then(function(result) {
          if(result[0].tag == "SpielSuccess") {
            props.setShareLink(result[0].contents);
          } else {
            alert("Unable to share!");
          }
        }).catch(function(err) {
          alert("Failed to share!");
        })}>Share</Button>
      }

    }

    // Uses React-Router to change page
    return (
        <Navbar bg="danger" variant="dark" expand="lg" fixed="top">
            <Navbar.Brand>BoGL: Board Game Language</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Editor</Nav.Link>
                    <NavDropdown title="Themes" id="basic-nav-dropdown">
                        {getThemes()}
                    </NavDropdown>
                </Nav>
                <Form inline>
                  {getShareOption()}
                </Form>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default SpielNavbar;
