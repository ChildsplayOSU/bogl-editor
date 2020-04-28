# Spiel-Front

Front-end for Spiel language.

This project is bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Libraries used:
* [react-bootstrap](https://react-bootstrap.github.io/)
* [CodeMirror](https://codemirror.net/)
* [react-router](https://github.com/ReactTraining/react-router)
* [terminal-in-react](https://github.com/nitin42/terminal-in-react)

## Installation
- Install [Stack](https://docs.haskellstack.org/en/stable/README/), which is required for building the language and backend itself.
- Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you don't already have it.
- Ensure that you are running a recent version of node by checking `node --version` against the [current node releases](https://nodejs.org/en/).
- From this project root, run `npm run setup` once. This will clone, build, and install the backend for you.
- To start the front-end and back-end servers, you can run `npm run startProduction`. You should have a browser window open up, and you can select the Editor tab to start coding.

## Tutorial

For specific tutorial examples, please refer to these [tutorial files](https://github.com/The-Code-In-Sheep-s-Clothing/Spiel-Lang/tree/master/examples/tutorials), which can help you get started working with this language.

You can run any Spiel code from the editor with everything set up properly. First, make sure you've written any valid Spiel code in the editor.

Then, you can use a series of commands to run your code:

 * `save <filename>`: Saves the code in the editor as a file named `<filename>.bgl` and sets running environment to that file
 * `command <expression/command>`: Runs REPL (Read, Evaluate, Print, Loop) command under the current running environment
 * `game <game loop/function call>`: Sets the current game environment to `<game loop/function call>`
 * `move <Input value>`: Adds `<Input value>` to list of moves and executes list of moves in current `game` and running environments
 * `restart`: Clears current list of moves

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
