import * as React from 'react';
import './SpielEditor.css';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/midnight.css';
import 'codemirror/mode/markdown/markdown';

type EditorConfig = {
    tabSize: number,
    lineNumbers: boolean,
    mode: string,
    theme: string
}


const SpielEditor: React.FC = () => { 

    let [code, setCode] = React.useState('');


    let option: EditorConfig = {
        tabSize: 3,
        lineNumbers: true,
        mode: 'markdown',
        theme: 'midnight'
    };

    return (
        <>
            <CodeMirror
                value={code}
                onChange={setCode}
                options={option}
            />
            <p>
            {code}
            </p>
        </>
    );
}

export default SpielEditor;
