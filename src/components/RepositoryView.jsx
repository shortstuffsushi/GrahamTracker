import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import CommitList from './Commits/CommitList';

export default class RepositoryView extends Component {
    static propTypes = {
        repo: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            commits: []
        };
    }

    componentDidMount() {
        this.loadCommits();
    }

    render() {
        return (
            <div>
                <h1>{this.props.repo.name}</h1>

                <button onClick={this.loadStatus}>Status</button>
                <CommitList commits={this.state.commits} />

            </div>
        );
    }

    loadCommits = () => {
        ipcRenderer.once('repo-commit-list', (evt, commits) => {
            this.setState({ commits });
        });

        ipcRenderer.send('repo-list-commits', this.props.repo.id);
    }

    loadStatus = () => {
        ipcRenderer.once('repo-status-result', (evt, statuses) => {
            console.log(statuses)
        });

        ipcRenderer.send('repo-status', this.props.repo.id);
    }
}
