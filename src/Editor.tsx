import * as React from 'react';
import Form from 'react-bootstrap/Form';

interface State {
    code: string;
};


const Editor: React.FC = () => { 

    let [code, setCode] = React.useState("");
     
    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label>"HELLO"</Form.Label>
                    <Form.Control value={code} onInput={e => setCode(e.target.value)} as="textarea" rows="10" />
                </Form.Group>
            </Form>
            <p>
            {code}
            </p>
        </>
    );
}

export default Editor;
