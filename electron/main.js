const path = require('path')

const {app, BrowserWindow, dialog} = require('electron')
const child_process = require('child_process')

let SpielServer // Don't garbage collect the child process!
let win

function createWindow () {
	win = new BrowserWindow({width: 800,
                           height: 600,
                           webPreferences: { nodeIntegration: true }});
	//win.loadURL('http://localhost:3000/');
	win.loadURL(`file://${path.join(__dirname, '../index.html')}`)
}
function languageServer () {
	console.log(`Looking for spielserver at: ${process.resourcesPath}/resources/spielserver`);
	let thePath = process.resourcesPath + "/resources/spielserver";
	SpielServer = child_process.spawn(thePath);
	SpielServer.on('stdout', (data) => {
		console.log(`spielserver: ${data}`);
	});
	SpielServer.on('stderr', (data) => {
		console.log(`spielserver (err): ${data}`)});
}
  app.on('ready', createWindow);
  app.on('ready', languageServer);
  app.on('will-quit', function () {
  SpielServer.kill();
});
