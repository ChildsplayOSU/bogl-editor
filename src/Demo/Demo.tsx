import * as React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/midnight.css';
import 'codemirror/mode/haskell/haskell';

import './Demo.css';

const Demo = ({ theme }) => { 

    let [code, setCode] = React.useState('game TicTacToe\ntype Board = Grid(3,3) of AnySymbol\ntype Input = Position -- currently ignored anyways\nempty : Board\nempty(positions) = Empty');
    let [editor, setEditor] = React.useState();
        
    function updateCode(x: string) {
        setCode(x);
    };

    function setReadOnly(editor) {
        editor.markText({line:1,ch:0},{line:3,ch:0},{readOnly:true, className:"readonly"});
    }


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
                editorDidMount={editor => { setReadOnly(editor); setEditor(editor); }}
            />
        </>
    );
}

export default Demo;
