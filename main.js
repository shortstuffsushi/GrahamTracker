const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const nodeGit = require('nodegit');
const isDevBuild = process.env.NODE_ENV === 'development';

let mainWindow;

const repoWindows = { };

function generateWindowUrl(fileName) {
    const generatedUrl = isDevBuild ?
        url.format({
            protocol: 'http:',
            host: 'localhost:8080',
            pathname: fileName,
            slashes: true
        }) :
        url.format({
            protocol: 'file:',
            pathname: path.join(__dirname, 'dist', fileName),
            slashes: true
        });

    return generatedUrl;
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1024, height: 768, show: false
    });

    mainWindow.loadURL(generateWindowUrl('index.html'));

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

ipcMain.on('repo-select', (evt, filepath) => {
    nodeGit.Repository
        .open(filepath)
        .then(repo => {
            const projectName = filepath.split(path.sep).pop();
            evt.sender.send('valid-repo-selected', {
                name: projectName
            });
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
