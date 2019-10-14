import React from 'react';
import PropTypes from 'prop-types';

import ReactTable from "react-table";
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

import File from '../../models/file';
import {
  HIDE_STAR,
  STAR,
  STAR_BORDER
} from './app-base.jsx';
import {
  getDirColumns,
  getHistoryColumns,
  getBookmarkListColumns,
  getBookmarkColumns,
} from './file-list-config.js';

import "react-table/react-table.css";

const headerHeight = 48;
const styles = theme => ({
  textField: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.shape.borderRadius
  },
});

const getColumns = (isBookmarked, id) => [
  {
    Header: '',
    id: 'check',
    accessor: 'id',
    Cell: r => (
      <Button
        size="small"
        color="inherit"
        onClick={(e) => {
          e.stopPropagation();
          playBookmarkList(r.value);
        }}
        style={{
          padding: '3px 6px',
          minWidth: '64px',
          fontSize: '0.609375rem',
          minHeight: '21px'
        }}
      >
        <PlayIcon />
      </Button>
    ),
    width: 120,
    style: {
      'textAlign': 'center'
    }
  },
  {
    Header: 'Name',
    id: 'name',
    accessor: 'name'
  }
];

class EditBookmark extends React.Component {

  render() {
    const {
      files,
    } = this.props;
    return (
        <ReactTable
          className="-striped -highlight"
          style={{
            height: `calc(100vh - ${headerHeight}px)`
          }}
          data={_files}
          pageSize={Math.min(300, Math.max(files.length, 20))}
          pageSizeOptions={[ ]}
          columns={columns}
        />
    );
  }
}

Directory.propTypes = {
  add_bookmark: PropTypes.func.isRequired,
  delete_bookmark: PropTypes.func.isRequired,
};

export default withStyles(styles)(EditBookmark);
