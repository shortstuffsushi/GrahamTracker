import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';

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

                <ul>
                    {this.state.commits.map(commit => <li key={`${commit.sha}-commit`}>{commit.author} - {commit.message}</li>)}
                </ul>
            </div>
        );
    }

    loadCommits = () => {
        ipcRenderer.once('repo-commit-list', (evt, commits) => {
            this.setState({ commits });
        });

        ipcRenderer.send('repo-list-commits', this.props.repo.id);
    }
}
