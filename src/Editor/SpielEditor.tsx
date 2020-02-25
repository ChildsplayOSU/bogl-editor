import * as React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/haskell/haskell';

import 'codemirror/theme/midnight.css';
import 'codemirror/theme/gruvbox-dark.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/nord.css';

import './SpielEditor.css';

const SpielEditor = ({ editorTheme }) => { 

    let [code, setCode] = React.useState('');
    let [editor, setEditor] = React.useState();

    function updateCode(c: string) {
        setCode(c);
        console.log(editorTheme);
    };

    return (
        <>
            <CodeMirror 
                value={code}
                onBeforeChange={(editor, data, value) => {
                    updateCode(value);
                }}
                options={{
                    tabSize: 3,
                    lineNumbers: true,
                    mode: 'haskell',
                    theme: editorTheme, 
                    readOnly: false
                }}
                editorDidMount={editor => { setEditor(editor); }}
            />
        </>
    );
}

export default SpielEditor;
