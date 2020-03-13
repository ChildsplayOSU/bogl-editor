import * as React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { BrowserRouter as NavLink, Link } from "react-router-dom";

import './SpielNavbar.css';

const SpielNavbar = (props) => {

    const themes: Array<string> = ["default", "midnight", "gruvbox-dark", "solarized", "nord"]; 

    function getThemes() {
        let navitems: Array<JSX.Element> = [];
        for (let i = 0; i < themes.length; i++) {
            navitems.push(<NavDropdown.Item onClick={() => props.setTheme(themes[i]) }>{ themes[i] }</NavDropdown.Item>);

        }
        return navitems; 
    }

    return (
        <Navbar bg="danger" variant="dark" expand="lg" fixed="top">
            <Navbar.Brand>Spiel Language</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/">Editor</Nav.Link>
                    <Nav.Link as={Link} to="/tutorial">Tutorial</Nav.Link>
                    <NavDropdown title="Themes" id="basic-nav-dropdown">
                        {getThemes()}
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
    //<Nav.Link onClick={props.modal}>Run</Nav.Link>;
}

export default SpielNavbar;
