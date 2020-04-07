const path = require('path')



const {app, BrowserWindow} = require('electron')
const child_process = require('child_process')

let SpielServer // Don't garbage collect the child process!
let win

function createWindow () {
	win = new BrowserWindow({width: 800, height: 600});
	//win.loadURL('http://localhost:3000/');
	win.loadURL(`file://${path.join(__dirname, '../index.html')}`)
}
function languageServer () {
	console.log(`Looking for spielserver at: ${process.resourcesPath}`);
	thePath = process.resourcesPath + "/resources/spielserver";
	SpielServer = child_process.spawn(thePath);
}
  app.on('ready', createWindow);
  app.on('ready', languageServer);
  app.on('will-quit', function () {
  SpielServer.kill();
});
