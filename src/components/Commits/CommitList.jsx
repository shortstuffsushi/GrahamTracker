import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import CommitView from './CommitView';

export default class CommitList extends Component {
    static propTypes = {
        commits: PropTypes.array.isRequired
    }

    render() {
        return (
            <div className="commit-list">
                <div className="commit-titles">
                    <span className="commit-graph-title">Graph</span>
                    <span className="commit-title">Description</span>
                    <span className="commit-title">Date</span>
                    <span className="commit-title">Author</span>
                    <span className="commit-sha-title">Commit</span>
                </div>
                <div>
                    {this.props.commits.map(commit => <CommitView key={`${commit.sha}-commit`} commit={commit} />)}
                </div>
            </div>
        );
    }
}
