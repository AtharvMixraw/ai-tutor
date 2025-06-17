const {app, BrowserWindow} = require('electron');
const path = require('path');

function createwindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('public/index.html'); 
}
app.whenReady().then(createwindow);