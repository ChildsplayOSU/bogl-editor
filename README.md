# Spiel-Front

Front-end for Spiel language.

This project is bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Libraries used:
* [react-bootstrap](https://react-bootstrap.github.io/)
* [CodeMirror](https://codemirror.net/)
* [react-router](https://github.com/ReactTraining/react-router)
* [terminal-in-react](https://github.com/nitin42/terminal-in-react)

## Installation from Existing Package
- We have a preconfigured macOS package suitable for testing purposes, you can download [our beta release here](https://github.com/The-Code-In-Sheep-s-Clothing/Spiel-Front/releases/download/beta3/spiel-front-0.1.0.dmg). Note, because it is unsigned you will need to open it via Cmd + Right Click, and select open from the options. If you don't macOS will complain about it being an not a legitimate mac app.
- A linux package is available, but not yet uploaded.
- For Windows you will have to build from source.

## Installation from Source
- Install [Stack](https://docs.haskellstack.org/en/stable/README/), which is required for building the language and backend itself.
- Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you don't already have it.
- Ensure that you are running a recent version of node by checking `node --version` against the [current node releases](https://nodejs.org/en/).
- From this project root, run `npm run setup` once. This will clone, build, and install the backend for you.
- To start the front-end and back-end servers, you can run `npm run startProduction`. You should have a browser window open up, and you can select the Editor tab to start coding.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
