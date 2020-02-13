import * as React from 'react';
import * as CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/midnight.css';
import 'codemirror/mode/haskell/haskell';
import './SpielEditor.css';

const SpielEditor = ({ theme }) => { 

    let [code, setCode] = React.useState('');

    function updateCode(x: string) {
        setCode(x);
    };

    return (
        <>
            <CodeMirror
                value={code}
                onChange={updateCode}
                options={{
                    tabSize: 3,
                    lineNumbers: true,
                    mode: 'haskell',
                    theme: theme 
                }}
            />
        </>
    );
}

export default SpielEditor;
