import * as React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/midnight.css';
import 'codemirror/mode/haskell/haskell';

import './SpielEditor.css';

const SpielEditor = ({ theme }) => { 

    let [code, setCode] = React.useState('');
    let [editor, setEditor] = React.useState();

    function updateCode(x: string) {
        setCode(x);
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
                    theme: 'midnight',
                    readOnly: false
                }}
                editorDidMount={editor => { setEditor(editor); }}
            />
        </>
    );
}

export default SpielEditor;
