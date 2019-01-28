import React from 'react';
import PropTypes from 'prop-types';

import ReactTable from "react-table";
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import RefreshIcon from '@material-ui/icons/Refresh';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles } from '@material-ui/core/styles';

import File from '../../models/file';
import AppBase from '../../containers/app-base.js';
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

class Directory extends React.Component {
  constructor(props) {
    super(props);
    this.searchRef = React.createRef();
    this.state = {
      searchWord: ''
    };
  }

  handleChangeSearch = (e) => {
    console.log(e.target.value);
    this.setState({
      searchWord: e.target.value
    });
  }

  renderHeaderRight() {
    const {
      classes,
      refresh,
      clear_history,
      column_type,
    } = this.props;
    switch (column_type) {
      case 'history':
        return [
          <IconButton
            color="inherit"
            onClick={() => clear_history()}
          >
            <DeleteIcon />
          </IconButton>,
          <IconButton
            color="inherit"
            onClick={() => refresh()}
          >
            <RefreshIcon />
          </IconButton>
        ];
      case 'dir':
      default:
        return [
          <TextField
            type="search"
            className={classes.textField}
            inputRef={this.searchRef}
            onChange={this.handleChangeSearch}
          />,
          <IconButton
            color="inherit"
            onClick={() => refresh()}
          >
            <RefreshIcon />
          </IconButton>
          ];
    }
  }

  render() {
    const {
      cd,
      select_bookmark_list,
      play_bookmark_list,
      delete_bookmark_list,
      delete_bookmark,
      delete_history,
      sort_condition,
      files,
      column_type,
      sort_column,
      sort_desc,
    } = this.props;
    const columns = (() => {
      switch (column_type) {
        case 'dir':
          return getDirColumns();
        case 'history':
          return getHistoryColumns(delete_history);
        case 'bookmark-list':
          return getBookmarkListColumns(play_bookmark_list, delete_bookmark_list);
        case 'bookmark':
          return getBookmarkColumns(delete_bookmark);
      }
    })();
    let _files;
    if (this.state.searchWord === '') {
      _files = files;
    } else {
      _files = files.filter(f => f.name.includes(this.state.searchWord));
    }
    return (
      <AppBase headerRight={this.renderHeaderRight()} >
        <ReactTable
          className="-striped -highlight"
          style={{
            height: `calc(100vh - ${headerHeight}px)`
          }}
          data={_files}
          pageSize={Math.min(300, Math.max(files.length, 20))}
          pageSizeOptions={[ ]}
          getTdProps={(state, row, col, inst) => {
            return {
              onClick: (e, handleOriginal) => {
                const file = row && row.original;
                if (file) {
                  if (column_type === 'bookmark-list') {
                    select_bookmark_list(file.id);
                  } else {
                    cd(file.type, file.id, file.index);
                  }
                }
              }
            };
          }}
          defaultSorted={[{
            id: sort_column,
            desc: sort_desc
          }]}
          onSortedChange={(newSorted, column, shiftKey) => {
            const {
              id,
              desc
            } = newSorted[0];
            sort_condition(id, desc);
          }}
          columns={columns}
        />
      </AppBase>
    );
  }
}

Directory.propTypes = {
  column_type: PropTypes.string,
  files: PropTypes.arrayOf( PropTypes.instanceOf(File) ),
  cd: PropTypes.func.isRequired,
  select_bookmark_list: PropTypes.func.isRequired,
  play_bookmark_list: PropTypes.func.isRequired,
  delete_bookmark_list: PropTypes.func.isRequired,
  delete_bookmark: PropTypes.func.isRequired,
  delete_history: PropTypes.func.isRequired,
  clear_history: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  sort_condition: PropTypes.func.isRequired,
  sort_column: PropTypes.string.isRequired,
  sort_desc: PropTypes.bool.isRequired,
};

export default withStyles(styles)(Directory);
