import React from 'react';
import moment from 'moment';
import filesize from 'filesize';

import Button from '@material-ui/core/Button';
import PlayIcon from '@material-ui/icons/PlaylistPlay';
import DeleteIcon from '@material-ui/icons/Delete';

export const getDirColumns = (onClick) => [
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
];

export const getHistoryColumns = (deleteHistory) => [
  {
    Header: 'Name',
    id: 'name',
    accessor: 'name'
  },
  {
    Header: 'Index',
    id: 'index',
    width: 100,
    accessor: 'index',
    style: {
      'textAlign': 'right'
    }
  },
  {
    Header: '更新日時',
    id: 'mtime',
    width: 200,
    resizable: false,
    accessor: f => moment(f.mtime).utcOffset(9).format('YYYY/MM/DD HH:mm:ss'),
    style: {
      'textAlign': 'center'
    }
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
  },
  {
    Header: '削除',
    id: 'delete',
    accessor: 'id',
    Cell: r => (
      <Button
        size="small"
        color="inherit"
        onClick={(e) => {
          e.stopPropagation();
          deleteHistory(r.value);
        }}
        style={{
          padding: '3px 6px',
          minWidth: '64px',
          fontSize: '0.609375rem',
          minHeight: '21px'
        }}
      >
        <DeleteIcon />
      </Button>
    ),
    width: 120,
    style: {
      'textAlign': 'center'
    }
  }
];

export const getBookmarkListColumns = (playBookmarkList, deleteBookmarkList) => [
  {
    Header: 'Name',
    id: 'name',
    accessor: 'name'
  },
  {
    Header: '再生',
    id: 'play',
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
    Header: '削除',
    id: 'delete',
    accessor: 'id',
    Cell: r => (
      <Button
        size="small"
        color="inherit"
        onClick={(e) => {
          e.stopPropagation();
          deleteBookmarkList(r.value);
        }}
        style={{
          padding: '3px 6px',
          minWidth: '64px',
          fontSize: '0.609375rem',
          minHeight: '21px'
        }}
      >
        <DeleteIcon />
      </Button>
    ),
    width: 120,
    style: {
      'textAlign': 'center'
    }
  }
];

export const getBookmarkColumns = (deleteBookmark) => [
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
  },
  {
    Header: '削除',
    id: 'delete',
    accessor: 'id',
    Cell: r => (
      <Button
        size="small"
        color="inherit"
        onClick={(e) => {
          e.stopPropagation();
          deleteBookmark(r.value);
        }}
        style={{
          padding: '3px 6px',
          minWidth: '64px',
          fontSize: '0.609375rem',
          minHeight: '21px'
        }}
      >
        <DeleteIcon />
      </Button>
    ),
    width: 120,
    style: {
      'textAlign': 'center'
    }
  }
]
