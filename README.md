# Spiel-Front

Front-end for Spiel language.

This project is bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Libraries used:
* [react-bootstrap](https://react-bootstrap.github.io/)
* [CodeMirror](https://codemirror.net/)
* [react-router](https://github.com/ReactTraining/react-router)
* [terminal-in-react](https://github.com/nitin42/terminal-in-react)

## Installation

Requires ability to run [Spiel-Lang](https://github.com/The-Code-In-Sheep-s-Clothing/Spiel-Lang.git). To install, run `npm run setup`. Then, to start the front-end and back-end servers, run `npm run startProduction`. 

## Tutorial

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
