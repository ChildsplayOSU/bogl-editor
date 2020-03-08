import * as React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


// Class for representing requests
// that can be made to the Spiel Language Server
class SpielServerRequest {

  // Change to Backend API
  static SPIEL_API = "http://localhost:8080";


  // creates a new file with the given content
  // automatically adds '.bgl' to whatever the name is
  // so 'TEST' will be 'TEST.bgl' serverside
  // (to protect overwriting existing non-bgl files)
  static save(fileName,content) {
    return fetch(SpielServerRequest.SPIEL_API+'/save', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: fileName,
        content: content,
      }),
    });
  }

  static read(fileName) {
    return fetch(SpielServerRequest.SPIEL_API+'/read', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        path: fileName
      }),
    });
  }


  // requests the test endpoint,
  // just to make sure things are working
  static test() {
    return fetch(
        SpielServerRequest.SPIEL_API+"/test", {
          method: "GET"
        });
  }


  // "examples/TicTacToe.bgl"
  // ["2 + 2","3 * 3","20 / 4"]
  // Runs a file with the given commands
  static runCmds(fileToUse,commands) {
    return fetch(SpielServerRequest.SPIEL_API+'/runCmds', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        file: fileToUse,
        inputs: commands,
      }),
    })
  }


  static parse_response(res: JSON) {
    // TODO needs to be implmeneted
      // Board
      // Value
      // Game Result
      // Parse Error
      // Type Error
  }

}

const Run = (props) => {
    let [input,setInput] = React.useState('');
    return (
	<Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Input</Form.Label>
                    <Form.Control as="textarea" rows="1" value={input}/>
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.runCode}>Run</Button>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
	</Modal>
  )
}

export {Run,SpielServerRequest};
