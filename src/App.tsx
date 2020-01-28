import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SpielEditor from './SpielEditor/SpielEditor';
import SpielNavbar from './SpielNavbar/SpielNavbar';

const App: React.FC = () => {

    //let [userTheme, setTheme] = React.useState('midnight');

    return (
        <>
            <SpielNavbar />
            <SpielEditor />
        </>
    );
}

export default App;
