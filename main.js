const { app, BrowserWindow } = require('electron');
const path = require('path')
const url = require('url')

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024, height: 768, show: false
    });

    const isDevBuild = process.env.NODE_ENV === 'development';
    const indexPath = isDevBuild ?
        url.format({
            protocol: 'http:',
            host: 'localhost:8080',
            pathname: 'index.html',
            slashes: true
        }) :
        url.format({
            protocol: 'file:',
            pathname: path.join(__dirname, 'dist', 'index.html'),
            slashes: true
        });

    mainWindow.loadURL(indexPath);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        if (isDevBuild) {
            mainWindow.webContents.openDevTools();
        }
    });

    mainWindow.on('closed', function() {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
