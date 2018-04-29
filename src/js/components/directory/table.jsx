import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'material-ui/Tooltip';
import naturalCompare from 'natural-compare';

import {
  SortingState, IntegratedSorting,
  FilteringState, IntegratedFiltering
} from '@devexpress/dx-react-grid';
import {
  Grid,
  TableColumnResizing,
  TableFilterRow,
  VirtualTable, TableHeaderRow
} from '@devexpress/dx-react-grid-material-ui';

import moment from 'moment';
import numeral from 'numeral';

import File from '../../models/file';

const tableColumnExtensions = [
  { columnName: 'mtime' },
  { columnName: 'type', align: '' },
  { columnName: 'size', align: 'right' }
];

/*
const nameCompare = (a, b) => {
  return naturalCompare(a, b);
};
*/

const defaultSort = [
  { columnName: 'name', direction: 'asc' },
  { columnName: 'mtime', direction: 'asc' },
];

const integratedSortingExtensions = [
  { columnName: 'name', compare: naturalCompare }
];

const columns = [
  { name: 'name', title: 'Name' },
  { name: 'mtime', title: 'mtime' },
  { name: 'type', title: 'type' },
  { name: 'size', title: 'size' },
];

const shape = {
  id: PropTypes.string,
  name: PropTypes.string,
  mtime: PropTypes.number,
  type: PropTypes.string,
  size: PropTypes.number
};

const getRow = handleSelected => rowProps => (
  <VirtualTable.Row
    hover
    {...rowProps}
    style={{
      cursor: 'pointer'
    }}
    onClick={() => {
      handleSelected(rowProps.row);
    }}
  />
);

const getIconName = (type) => {
  switch (type) {
    case 'directory':
      return 'folder-o';
    case 'zip':
    case 'rar':
      return 'file-archive-o';
    case 'png':
    case 'gif':
    case 'jpg':
    case 'jpeg':
      return 'file-image-o';
    case 'm3u8':
    case 'mp4':
      return 'file-video-o';
    default:
      return 'file';
  }
};

const Cell = (props) => {
  if (props.column.name === 'mtime') {
    return (
      <VirtualTable.Cell {...props}>
        {moment(props.row.mtime).utcOffset(9).format('YYYY/MM/DD HH:mm:ss')}
      </VirtualTable.Cell>
    );
  }
  if (props.column.name === 'size') {
    return (
      <VirtualTable.Cell {...props}>
        {numeral(props.row.size).format('0.00 b')}
      </VirtualTable.Cell>
    );
  }
  if (props.column.name === 'type') {
    return (
      <VirtualTable.Cell {...props} >
        {props.row.type}
      </VirtualTable.Cell>
    );
  }
  const { type = '' } = props.row;
  return (
    <VirtualTable.Cell {...props} >
      <i className={`fa fa-${getIconName(type)}`} />
      <Tooltip title={props.row[props.column.name]}>
        <span style={{
          paddingLeft: '1em'
          }}
        >
          {props.row[props.column.name]}
        </span>
      </Tooltip>
    </VirtualTable.Cell>
  );
};

Cell.propTypes = {
  column: PropTypes.shape(shape).isRequired,
  row: PropTypes.shape(shape).isRequired,
};

const FilterCell = (props) => {
  switch (props.column.name) {
    case 'mtime':
    case 'size':
      return <VirtualTable.Cell {...props} />;
    case 'name':
    case 'type':
    default:
      return <TableFilterRow.Cell {...props} />;
  }
};

FilterCell.propTypes = {
  column: PropTypes.shape(shape).isRequired
};

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterConditions: [],
      columnWidths: [
        {
          columnName: 'name',
          width: 900
        },
        {
          columnName: 'mtime',
          width: 150
        },
        {
          columnName: 'size',
          width: 100
        },
        {
          columnName: 'type',
          width: 100
        },
      ]
    };
  }

  render() {
    const rows = this.props.files;
    const Row = getRow(this.props.onSelected);
    return (
      <Grid
        rows={rows}
        columns={columns}
        getRowId={row => row.id}
      >
        <FilteringState
          filters={this.state.filterConditions}
          onFiltersChange={(filters) => {
            console.log('onFiltersChange');
            this.setState({
              filterConditions: filters
            });
          }}
        />
        <IntegratedFiltering />

        <SortingState
          defaultSorting={defaultSort}
        />
        <IntegratedSorting
          columnExtensions={integratedSortingExtensions}
        />
        <VirtualTable
          height={this.props.height}
          columnExtensions={tableColumnExtensions}
          rowComponent={Row}
          cellComponent={Cell}
        />
        <TableColumnResizing
          columnWidths={this.state.columnWidths}
          onColumnWidthsChange={(widths) => {
            console.log('onColumnWidthsChange');
            this.setState({
              columnWidths: widths
            });
          }}
        />
        <TableFilterRow
          cellComponent={FilterCell}
        />
        <TableHeaderRow showSortingControls />
      </Grid>
    );
  }
}

Table.propTypes = {
  files: PropTypes.arrayOf(PropTypes.shape(File.shape)).isRequired,
  height: PropTypes.number.isRequired,
  onSelected: PropTypes.func.isRequired,
};

export default Table;
