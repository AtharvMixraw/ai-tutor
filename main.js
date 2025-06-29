const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
    //   preload: path.join(__dirname, 'preload.js'), // if you need custom preload
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  win.loadFile('public/index.html');
}

app.whenReady().then(createWindow);
