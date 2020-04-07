const path = require('path')



const {app, BrowserWindow} = require('electron')
const child_process = require('child_process')

let SpielServer // Don't garbage collect the child process!

function createWindow () {
	win = new BrowserWindow({width: 800, height: 600});
	//win.loadURL('http://localhost:3000/');
	win.loadURL(`file://${path.join(__dirname, '../build/index.html')}`)
}
function languageServer () {
	SpielServer = child_process.spawn('./resources/spielserver'); // this probably needs to be different on windows...
}
app.on('ready', createWindow);
  app.on('ready', languageServer);
  app.on('will-quit', function () {
  SpielServer.kill();
});
