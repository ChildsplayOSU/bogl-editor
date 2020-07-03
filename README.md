# Spiel-Front

The front-end for the Spiel implementation of the BoGL language. The back end and interpreter for the language are accessible [here](https://github.com/The-Code-In-Sheep-s-Clothing/Spiel-Lang).

Please visit our [informational website](https://the-code-in-sheep-s-clothing.github.io/Spiel-Lang/) to learn more about what the project is and how you can access it without building from source. If you are detemined to build it from source, read the instructions below.

Libraries used:
* [react-bootstrap](https://react-bootstrap.github.io/)
* [CodeMirror](https://codemirror.net/)
* [react-router](https://github.com/ReactTraining/react-router)
* [terminal-in-react](https://github.com/nitin42/terminal-in-react)

## Installation Video
~You can watch [this video](https://media.oregonstate.edu/media/0_hxrt5f8y) for a quick tutorial on installing and running Spiel.~ We have since migrated this tool to an online hosted instance at http://bogl.engr.oregonstate.edu:5158, and there is no longer a need to install the tool for general usage.

<!-- Removed...
## Installation from Existing Package
- We have a preconfigured macOS package suitable for testing purposes, you can download [our beta release here](https://github.com/The-Code-In-Sheep-s-Clothing/Spiel-Front/releases/download/beta3/spiel-front-0.1.0.dmg). Note, because it is unsigned you will need to open it via Cmd + Right Click, and select open from the options. If you don't macOS will complain about it being an not a legitimate mac app.
- A linux package is available, but not yet uploaded.
- For Windows you will have to build from source.
-->

## Setting up a Development Environment
- Install [Stack](https://docs.haskellstack.org/en/stable/README/), which is required for building the language and backend itself.
- Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) if you don't already have it.
- Ensure that you are running a recent version of node by checking `node --version` against the [current node releases](https://nodejs.org/en/).
- If you haven't already clone this repo and the [backend repo](https://github.com/The-Code-In-Sheep-s-Clothing/Spiel-Lang). Where you decide to put them is up to you, but you will need them both to setup a development stack.
- From the backend repo, run `stack build`. This will take some time if this is your first time building the project.
  - *Note that this requires >= 4GB of RAM to succeed, otherwise the build process will stall out and spin forever until stopped. This is particularly important if you are provisioning an EC2 instance to run this stack on. Once the initial build process is done, you can safely resize it back down, as this is only needed for the first building of a particular dependent library.*
- With the backend built, you can run `stack ghci`.
- From ghci, you can run `startServer 5174`, which will start up a backend server listening on port 5174. You should get a message indicating this after you type this in.
- From the frontend repo, run `npm install` to install up all the necessary dependencies.
- Run `npm start` to begin the frontend. A browser window should be opened automatically, and after a small delay it should populate with a display of the online tool
- From here you should have a full stack for development purposes to work with. Changes can be made to the frontend and the backend, and can be rebuilt as needed.

If you run problems issues following these instructions, and you believe you've found an oversight on our part, let us know by [opening up an issue](https://github.com/The-Code-In-Sheep-s-Clothing/Spiel-Front/issues).

## Learn More
This project is bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
