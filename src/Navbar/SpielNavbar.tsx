import * as React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Share from './Share';

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

    // examples available
    let boglExamples: Array<Array<string>> = [
      ["Simplest Program","-- Simple Program example\ngame Simple\ntype Board = Array(1,1) of Int\ntype Input = Int"],
      ["Function", "--example of a function\ngame FunctionExample\ntype Board = Array(1,1) of Int\ntype Input = Int\n\nf : Int\nf = 1"],
      ["Function with Parameter", "--example of a function that takes a parameter\ngame FunctionParamExample\ntype Board = Array(1,1) of Int\ntype Input = Int\n\n--adds 1 to whatever number we give this function\nf : Int -> Int\nf(x) = x + 1"],
      ["Board","--example of a simple board\ngame BoardExample\ntype Board = Array(3,3) of Int\ntype Input = Int\n\n--a board called 'ex' where every space is 0\nex : Board\nex!(x,y) = 0"],
      ["Simple Input","--example of taking in simple input\ngame SimpleInput\ntype Board = Array(1,1) of Int\ntype Input = Int\n\n--a function that adds 2 numbers together\nadd : Int -> Int\nadd(x) = let y = input in x + y"],
      ["Place a Piece","--example of placing a piece on a board\ngame PlacePiece\n\ntype Board = Array(3,3) of Int\ntype\nPosition = (Int,Int)\ntype Input = Position\n\n--a new board of 0's\nb : Board\nb!(x,y) = 0\n\n-- a function to place a piece on this board\nplacePiece : Board -> Board\nplacePiece(board) = let pos = input in place(1,board,pos)"]
    ];

    // Generate example list to be used in drop down
    function getBoGLExamples() {
        let navitems: Array<JSX.Element> = [];
        for(let i = 0; i < boglExamples.length; i++) {
          // TODO set this up so that the updatd examples populate back to the other router
          navitems.push(<NavDropdown.Item onClick={() => props.setCode(boglExamples[i][1]) }>{ boglExamples[i][0] }</NavDropdown.Item>);
        }
        return navitems;
    }


    function getShareOption() {
      if(didShare) {
        // share link is ready to display, show it!
        return <Share shareLink={props.getShareLink()}/>;

      } else {
        // share link has NOT been generated yet
        return <Button variant="outline-light" title="Generates share link for Prelude" type="button" onClick={(e) => props.sharePrelude().then(function(result) {
          if(result[0].tag === "SpielSuccess") {
            // update that we shared and modify link
            setDidShare(true);
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
                    <NavDropdown title="Examples" id="basic-nav-dropdown">
                        {getBoGLExamples()}
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
