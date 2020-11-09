# bogl-editor

[![Build Status](https://travis-ci.com/The-Code-In-Sheep-s-Clothing/bogl-editor.svg?branch=master)](https://travis-ci.com/The-Code-In-Sheep-s-Clothing/bogl-editor)

This is the front-end for the implementation of BoGL (the Board Game Language). The front-end is an interactive HTML5 web application with a syntax editor and a REPL interface. BoGL code is written into the syntax editor, expressions are typed into the REPL, and the code & expression under evaluation are sent to the stateless back-end to produce a result.

If you're looking for the stateless back-end, including the interpreter for BoGL (syntax, typechecker, evaluator), then you can find the repository for that project [here](https://github.com/The-Code-In-Sheep-s-Clothing/bogl).

You can also visit our [informational website](https://bogl.engr.oregonstate.edu/tutorials) to learn more about our language.

Libraries used:
* [react-bootstrap](https://react-bootstrap.github.io/)
* [CodeMirror](https://codemirror.net/)
* [react-router](https://github.com/ReactTraining/react-router)
* [terminal-in-react](https://github.com/nitin42/terminal-in-react)

## Setting up a Development Environment
- Install [Stack](https://docs.haskellstack.org/en/stable/README/), which is required for building the language and backend itself.
- Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you don't already have it.
- Ensure that you are running a recent version of node by checking `node --version` against the [current node releases](https://nodejs.org/en/).
- If you haven't already clone this repo and the [backend repo](https://github.com/The-Code-In-Sheep-s-Clothing/bogl). Where you decide to put them is up to you, but you will need them both to setup a development stack.
- From the backend repo, run `stack build`. This will take some time if this is your first time building the project.
  - *Note that this requires >= 4GB of RAM to succeed, otherwise the build process will stall out and spin forever until stopped. This is particularly important if you are provisioning an EC2 instance to run this stack on. Once the initial build process is done, you can safely resize it back down, as this is only needed for the first building of a particular dependent library.*
- With the backend built, you can run `stack ghci`.
- From ghci, you can run `startServer 5174`, which will start up a backend server listening on port 5174. You should get a message indicating this after you type this in.
- From the frontend repo, run `npm install` to install up all the necessary dependencies.
- Run `npm start` to begin the frontend. A browser window should be opened automatically, and after a small delay it should populate with a display of the online tool
- From here you should have a full stack for development purposes to work with. Changes can be made to the frontend and the backend, and can be rebuilt as needed.

If you run problems issues following these instructions, and you believe you've found an oversight on our part, let us know by [opening up an issue](https://github.com/The-Code-In-Sheep-s-Clothing/bogl-editor/issues).

## Learn More
This project is bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
