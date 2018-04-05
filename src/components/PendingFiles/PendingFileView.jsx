import React,{ Component } from 'react';
import PropTypes from 'prop-types';

import styles from '../../assets/css/PendingFiles/PendingFilesView.css';

export default class PendingFileListView extends Component {
    static propTypes = {
        file: PropTypes.object.isRequired
    }

    render() {
        let icon;

        if (this.props.file.isConflicted) {
            icon = '⚠️';
        }
        else if (this.props.file.isModified) {
            icon = '✏️';
        }
        else if (this.props.file.isNew) {
            icon = '➕';
        }
        else if (this.props.file.isDeleted) {
            icon = '❌';
        }

        return (
            <div>
                <span>{icon}</span>
                <span>{this.props.file.fileName}</span>
            </div>
        );
    }
}
