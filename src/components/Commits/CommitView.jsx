import React,{ Component } from 'react';
import PropTypes from 'prop-types';

import styles from '../../assets/css/CommitView.css';

export default class CommitView extends Component {
    static propTypes = {
        commit: PropTypes.object.isRequired
    }

    render() {
        const commitDate = new Date(this.props.commit.date);
        const formattedDate = commitDate.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
        });

        return (
            <div className="commit-view">
                <div className="commit-graph-view">
                    <svg height="18" width="8">
                        <circle cx="4" cy="9" r="4" fill="#000" />
                        <line x1="4" y1="0" x2="4" y2="18" strokeWidth="2" stroke="#000" />
                    </svg>
                </div>
                <div className="commit-message">{this.props.commit.message}</div>
                <div className="commit-date">{formattedDate}</div>
                <div className="commit-author">{this.props.commit.author}</div>
                <div className="commit-sha">{this.props.commit.sha.substring(0, 8)}</div>
            </div>
        );
    }
}
