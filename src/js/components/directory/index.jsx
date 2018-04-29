import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText } from 'material-ui/List';

import AppBar from '../../containers/appbar';
import Table from './table.jsx';
import File from '../../models/file';

class Directory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appBarHeight: 48,
      windowSize: {
        width: 100,
        height: 100
      }
    };
  }

  componentWillMount() {
    console.log('componentWillMount');
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      windowSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  render() {
    const { handleSelected } = this.props;
    const tableHeight = this.state.windowSize.height - this.state.appBarHeight;
    return (
      <div>
        <AppBar
          {...this.props}
          onChangeHeight={(height) => {
            this.setState({
              appBarHeight: height
            });
          }}
        >
          <ListItem
            button
            onClick={() => {
              this.props.refresh(this.props.current.id);
            }}
          >
            <ListItemText primary="更新" />
          </ListItem>
        </AppBar>
        <Table
          files={this.props.files}
          height={tableHeight}
          onSelected={(file) => {
            handleSelected(file.type, file.id);
          }}
        />
      </div>
    );
  }
}

Directory.propTypes = {
  current: PropTypes.shape(File.shape).isRequired,
  files: PropTypes.arrayOf(PropTypes.shape(File.shape)).isRequired,
  handleSelected: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
};

export default Directory;
