import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SpielEditor from './Editor/SpielEditor';
import SpielNavbar from './Navbar/SpielNavbar';
import Home from './HomePage/Home';
import Demo from './Demo/Demo';

const App: React.FC = () => {

    let [editorTheme, setEditorTheme] = React.useState('nord');

    function setTheme(theme: string) {
        setEditorTheme(theme);
    }

    return (
        <Router>
            <SpielNavbar setTheme={ setTheme } />
            <Route exact path="/" component={ Home } />
            <Route exact path="/free" render={(props) => <SpielEditor {...props} editorTheme={ editorTheme } setTheme={ setEditorTheme } />} />
            <Route exact path="/demo" render={(props) => <Demo {...props} theme={ editorTheme } setTheme={ setEditorTheme } />} />
        </Router>
    );
}

export default App;
