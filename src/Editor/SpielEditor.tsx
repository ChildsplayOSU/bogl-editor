import React from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import BoGLHighlight from './BoGLHighlight';
import 'codemirror/theme/midnight.css';
import 'codemirror/theme/gruvbox-dark.css';
import 'codemirror/theme/solarized.css';
import 'codemirror/theme/nord.css';

import './SpielEditor.css';

const SpielEditor = (props) => {

    function updateCode(value: string) {
        props.updateCode(value);
    };

    return (
        <>
            <CodeMirror
                value={props.code}
                onBeforeChange={(editor, data, value) => {
                    updateCode(value);
                }}
                defineMode={{
                  name: 'bogl',
                  fn: BoGLHighlight
                }}
                options={{
                    lineWrapping: true,
                    tabSize: 3,
                    lineNumbers: true,
                    mode: 'bogl',
                    theme: props.editorTheme,
                    readOnly: false
                }}

            />
        </>
    );
}

export default SpielEditor;
