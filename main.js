const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const nodeGit = require('nodegit');
const isDevBuild = process.env.NODE_ENV === 'development';
const uuid = require('uuid');

let mainWindow;

const repos = { };

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

ipcMain.on('repo-list-commits', (evt, repoUuid) => {
    const repo = repos[repoUuid];

    if (!repo) {
        evt.sender.send('invalid-repo-uuid', repoUuid);
        return;
    }

    repo.getMasterCommit()
        .then(function(firstCommitOnMaster) {
            var history = firstCommitOnMaster.history();

            const commits = [];
            history.on('commit', function(commit) {
                commits.push({
                    sha: commit.sha(),
                    author: commit.author().name(),
                    email: commit.author().email(),
                    date: commit.date(),
                    message: commit.message()
                });
            });

            history.on('end', function() {
                evt.sender.send('repo-commit-list', commits);
            });

            history.start();
        });
});

ipcMain.on('repo-select', (evt, filepath) => {
    nodeGit.Repository
        .open(filepath)
        .then(repo => {
            const projectName = filepath.split(path.sep).pop();
            const repoUuid = uuid();

            repos[repoUuid] = repo;

            evt.sender.send('valid-repo-selected', {
                id: repoUuid,
                name: projectName
            });
        })
        .catch(err => {
            evt.sender.send('invalid-repo-selected', path);
        });
});

ipcMain.on('repo-status', (evt, repoUuid) => {
    const repo = repos[repoUuid];

    if (!repo) {
        evt.sender.send('invalid-repo-uuid', repoUuid);
        return;
    }

    repo.getStatus()
        .then(statuses => {
            evt.sender.send('repo-status-result', statuses.map(status => ({
                fileName: path.basename(status.path()),
                path: status.path(),
                inIndex: !!status.inIndex(),
                isModified: !!status.isModified(),
                isConflicted: !!status.isConflicted(),
                isDeleted: !!status.isDeleted(),
                isNew: !!status.isNew(),
                isRenamed: !!status.isRenamed(),
                isTypechange: !!status.isTypechange()
            })));
        })
        .catch(e => {
            // TODO
            console.log(e)
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
