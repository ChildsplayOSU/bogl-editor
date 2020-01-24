import * as React from 'react';
import Editor from 'react-simple-code-editor';
import './SpielEditor.css';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

const SpielEditor: React.FC = () => { 

    let [code, setCode] = React.useState('');

     
    return (
        <>
            <Editor
                value={code}
                onValueChange={code => setCode(code)}
                highlight={code => highlight(code, languages.js)}
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
