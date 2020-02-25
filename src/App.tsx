import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SpielEditor from './Editor/SpielEditor';
import SpielNavbar from './Navbar/SpielNavbar';
import Home from './HomePage/Home';
import Tutorial from './Tutorial/Tutorial';

const App: React.FC = () => {

    let [editorTheme, setEditorTheme] = React.useState('default');

    function setTheme(theme: string) {
        setEditorTheme(theme);
    }

    return (
        <Router>
            <SpielNavbar setTheme={ setTheme } />
            <Route exact path="/" component={ Home } />
            <Route exact path="/free" render={(props) => <SpielEditor {...props} editorTheme={ editorTheme } />} />
            <Route exact path="/tutorial" render={(props) => <Tutorial {...props} editorTheme={ editorTheme } />} />
        </Router>
    );
}

export default App;
