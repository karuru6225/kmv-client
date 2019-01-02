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
      files
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
          showPagination={false}
          defaultPageSize={300}
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
            id: 'mtime',
            desc: true
          }]}
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
              accessor: f => moment(f.mtime).format('YYYY/MM/DD hh:mm:ss')
            },
            {
              Header: 'サイズ',
              id: 'size',
              accessor: f => filesize(f.size),
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
};

export default Directory;
