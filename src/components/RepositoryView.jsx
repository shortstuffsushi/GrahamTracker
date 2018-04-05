import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import CommitList from './Commits/CommitList';
import PendingFilesView from './PendingFiles/PendingFilesView';

export default class RepositoryView extends Component {
    static propTypes = {
        repo: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.state = {
            commits: [],
            statuses: []
        };
    }

    componentDidMount() {
        this.loadCommits();
        this.loadStatuses();
    }

    render() {
        return (
            <div>
                <h1>{this.props.repo.name}</h1>

                <CommitList commits={this.state.commits} />

                <br />
                <br />

                <PendingFilesView statuses={this.state.statuses} />
            </div>
        );
    }

    loadCommits = () => {
        ipcRenderer.once('repo-commit-list', (evt, commits) => {
            this.setState({ commits });
        });

        ipcRenderer.send('repo-list-commits', this.props.repo.id);
    }

    loadStatuses = () => {
        ipcRenderer.once('repo-status-result', (evt, statuses) => {
            this.setState({ statuses });
        });

        ipcRenderer.send('repo-status', this.props.repo.id);
    }
}
