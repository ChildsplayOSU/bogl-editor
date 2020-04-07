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

    const themes: Array<string> = ["default", "midnight", "gruvbox-dark", "solarized", "nord"]; 

    function getThemes() {
        let navitems: Array<JSX.Element> = [];
        for (let i = 0; i < themes.length; i++) {
            navitems.push(<NavDropdown.Item onClick={() => props.setTheme(themes[i]) }>{ themes[i] }</NavDropdown.Item>);

        }
        return navitems; 
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        props.save();
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
                    <Form inline onSubmit={(e) => handleSubmit(e)}>
                        <FormControl onChange={(value) => props.setFilename(value.target.value)} type="text" placeholder="Filename"/>
                        <Button variant="dark" onClick={() => props.save()}>Save</Button>
                    </Form>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default SpielNavbar;
