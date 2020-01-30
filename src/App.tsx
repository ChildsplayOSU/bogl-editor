import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import SpielEditor from './Editor/SpielEditor';
import SpielNavbar from './Navbar/SpielNavbar';
import Home from './HomePage/Home';

const App: React.FC = () => {

    //let [userTheme, setTheme] = React.useState('midnight');

    return (
        <Router>
            <SpielNavbar />

            <Route exact path="/" component={Home} />
            <Route exact path="/free" component={SpielEditor} />
        </Router>
    );
}

export default App;
