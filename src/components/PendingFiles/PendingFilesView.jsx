import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import PendingFileListView from './PendingFileListView';

import styles from '../../assets/css/PendingFiles/PendingFilesView.css';

export default class PendingFilesView extends Component {
    static propTypes = {
        statuses: PropTypes.array.isRequired
    }

    render() {
        return (
            <div className="pending-files-view">
                <PendingFileListView
                    title="Staged Changed"
                    files={this.props.statuses.filter(x => x.inIndex)} />

                <PendingFileListView
                    title="Unstaged Changed"
                    files={this.props.statuses.filter(x => !x.inIndex)} />
            </div>
        );
    }
}
