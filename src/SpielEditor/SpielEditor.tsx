import * as React from 'react';
import Editor from 'react-simple-code-editor';
import './SpielEditor.css';
import { highlight, languages } from 'prismjs/components/prism-core.js';
import 'prismjs/components/prism-clike.js';
import 'prismjs/components/prism-javascript.js';


const SpielEditor: React.FC = () => { 

    let [code, setCode] = React.useState('');
     
    return (
        <>
            <Editor
                value={code}
                onValueChange={e => setCode(e)}
                highlight={e => highlight(e, languages.js)}
                padding={10}
                style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 12,
                }}
            />
            <p>
            {code}
            </p>
        </>
    );
}

export default SpielEditor;
