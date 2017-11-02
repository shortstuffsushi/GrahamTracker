import '../assets/css/App.css';
import React, { Component } from 'react';
import { ipcRenderer } from 'electron';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import RepositoryView from './RepositoryView';

import 'react-tabs/style/react-tabs.css';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            repoSelectionMessage: '',
            repos: []
        };
    }

    componentDidMount() {
        ipcRenderer.on('invalid-repo-selected', this.onInvalidRepoSelected);
        ipcRenderer.on('valid-repo-selected', this.onValidRepoSelected);
    }

    render() {
        return (
            <Tabs>
                <TabList>
                    {this.state.repos.map(repo => <Tab key={`${repo.name}-tab-name`}>{repo.name}</Tab>)}
                    <Tab>+</Tab>
                </TabList>

                {this.state.repos.map(repo => <TabPanel key={`${repo.name}-tab-panel`}><RepositoryView repo={repo} /></TabPanel>)}

                <TabPanel>
                    <div>
                        <h1>Graham Tracker</h1>

                        <label htmlFor="open-repo">Open a Repository</label>
                        <br />
                        <input name="open-repo" type="file" webkitdirectory="true" directory="true" onChange={this.onFileSelect}></input>
                        <br />
                        <br />
                        <span>{this.state.repoSelectionMessage}</span>
                    </div>
                </TabPanel>
            </Tabs>
        );
    }

    onFileSelect = (evt) => {
        const path = evt.target.files[0].path;

        ipcRenderer.send('repo-select', path);
    }

    onInvalidRepoSelected = (evt, path) => {
        this.setState({ repoSelectionMessage: `Folder at "${path}" is not a valid Git repository`});
    }

    onValidRepoSelected = (evt, repo) => {
        const updatedRepos = [ ...this.state.repos, repo ];

        // TODO set tab index?
        // currently this just happens to work because the + is the last one,
        // and when we add one, it just happens to become the active one because
        // it doesn't change active index. Not sure if we can rely on this forever
        this.setState({ repos: updatedRepos });
    }
}
