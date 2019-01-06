import React from 'react';
import PropTypes from 'prop-types';

import ReactTable from "react-table";
import moment from 'moment';
import filesize from 'filesize';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';

import File from '../../models/file';
import AppBase from '../common/app-base.jsx';

import "react-table/react-table.css";

const headerHeight = 48;

class Directory extends React.Component {
  renderHeaderRight() {
    const {
      refresh
    } = this.props;
    return (
      <IconButton
        color="inherit"
        onClick={() => refresh()}
      >
        <RefreshIcon />
      </IconButton>
    );
  }
  render() {
    const {
      current,
      cd,
      sort_condition,
      files,
      sort_column,
      sort_desc,
    } = this.props;
    return (
      <AppBase
        current={current}
        cd={cd}
        headerRight={this.renderHeaderRight()}
      >
        <ReactTable
          className="-striped -highlight"
          style={{
            height: `calc(100vh - ${headerHeight}px)`
          }}
          data={files}
          pageSize={Math.min(300, Math.max(files.length, 20))}
          pageSizeOptions={[ ]}
          getTdProps={(state, row, col, inst) => {
            return {
              onClick: (e, handleOriginal) => {
                const file = row && row.original;
                if (file) {
                  cd(file.type, file.id);
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
          columns={[
            {
              Header: 'Name',
              id: 'name',
              accessor: 'name'
            },
            {
              Header: '更新日時',
              id: 'mtime',
              width: 200,
              resizable: false,
              accessor: f => moment(f.mtime).utcOffset(9).format('YYYY/MM/DD HH:mm:ss')
            },
            {
              Header: 'サイズ',
              id: 'size',
              accessor: 'size',
              Cell: r => filesize(r.value),
              width: 120,
              style: {
                'textAlign': 'right'
              }
            }
          ]}
        />
      </AppBase>
    );
  }
}

Directory.propTypes = {
  current: PropTypes.instanceOf(File),
  files: PropTypes.arrayOf( PropTypes.instanceOf(File) ),
  cd: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  sort_condition: PropTypes.func.isRequired,
  sort_column: PropTypes.string.isRequired,
  sort_desc: PropTypes.bool.isRequired,
};

export default Directory;
