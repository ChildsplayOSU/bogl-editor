import * as React from 'react';
import * as CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/midnight.css';
import 'codemirror/mode/haskell/haskell';
import './SpielEditor.css';

type EditorConfig = {
    tabSize: number,
    lineNumbers: boolean,
    mode: string,
    theme: string
};

const SpielEditor: React.FC = () => { 

    let [code, setCode] = React.useState('');

    let userTheme: string = 'midnight';

    let option: EditorConfig = {
        tabSize: 3,
        lineNumbers: true,
        mode: 'haskell',
        theme: userTheme
    };

    function updateCode(x: string) {
        console.log(x);
        setCode(x);
    };


    return (
        <>
            <CodeMirror
                value={code}
                onChange={updateCode}
                options={option}
            />
        </>
    );
}

export default SpielEditor;
