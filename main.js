const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const nodeGit = require('nodegit');

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

ipcMain.on('repo-select', (evt, path) => {
    nodeGit.Repository
        .open(path)
        .then(repo => {
            evt.sender.send('valid-repo-selected', path);
        })
        .catch(err => {
            evt.sender.send('invalid-repo-selected', path);
        });
});

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
