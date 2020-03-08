import * as React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
//import '../SpielHighlight';
import 'codemirror/mode/haskell/haskell';

import Container from 'react-bootstrap/Container';

import 'codemirror/theme/midnight.css';
import 'codemirror/theme/gruvbox-dark.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/nord.css';

import './SpielEditor.css';

const SpielEditor = (props) => { 

    let [editor, setEditor] = React.useState();

    function updateCode(c: string) {
        props.setCode(c);
    };

    return (
        <>
            <CodeMirror 
                value={ props.code }
                onBeforeChange={(editor, data, value) => {
                    updateCode(value);
                }}
                options={{
                    lineWrapping: true,
                    tabSize: 3,
                    lineNumbers: true,
                    mode: 'haskell',
                    theme: props.editorTheme, 
                    readOnly: false
                }}
                editorDidMount={editor => { setEditor(editor); }}
            />
        </>
    );
}

export default SpielEditor;
