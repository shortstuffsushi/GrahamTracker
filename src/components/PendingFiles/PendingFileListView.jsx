import React,{ Component } from 'react';
import PropTypes from 'prop-types';
import PendingFileView from './PendingFileView';

import styles from '../../assets/css/PendingFiles/PendingFilesView.css';

export default class PendingFileListView extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        files: PropTypes.array.isRequired
    }

    render() {
        return (
            <div className="pending-file-list-view">
                <div className="pending-file-list-view-title">{this.props.title}</div>

                {this.props.files.map(x =>
                    <PendingFileView
                        file={x}
                        key={this.props.title.toLowerCase().replace(' ', '-') + '-file-' + x.fileName} /> )}
            </div>
        );
    }
}
