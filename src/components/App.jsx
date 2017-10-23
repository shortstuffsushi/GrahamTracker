import '../assets/css/App.css';
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            date: '',
            repoSelectionMessage: ''
        };
    }

    componentDidMount() {
        ipcRenderer.on('invalid-repo-selected', this.onInvalidRepoSelected);
        ipcRenderer.on('valid-repo-selected', this.onValidRepoSelected);
    }

    render() {
        return (
            <div>
                <h1>Graham Tracker</h1>
                <div>{this.state.date}</div>

                <label htmlFor="open-repo">Open a Repository</label>
                <br />
                <input name="open-repo" type="file" webkitdirectory="true" directory="true" onChange={this.onFileSelect}></input>
                <br />
                <br />
                <span>{this.state.repoSelectionMessage}</span>
            </div>
        );
    }

    onFileSelect = (evt) => {
        const path = evt.target.files[0].path;

        ipcRenderer.send('repo-select', path);
    }

    onInvalidRepoSelected = (evt, path) => {
        this.setState({ repoSelectionMessage: `Folder at "${path}" does not appear to be a Git repository`});
    }

    onValidRepoSelected = (evt, path) => {
        this.setState({ repoSelectionMessage: `Folder at "${path}" is a valid Git repository`});
    }
}
