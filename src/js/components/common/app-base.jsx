import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import File from '../../models/file';
import Layout from '../common/layout.jsx';

class AppBase extends React.Component {
  renderHeaderLeft() {
    const {
      cd,
      current
    } = this.props;
    return [
      <IconButton
        key='back'
        color="inherit"
        disabled={current.id === ''}
        onClick={() => cd('directory', current.parentId)}
      >
        <ArrowBackIcon />
      </IconButton>,
      <IconButton
        key='menu'
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
    ];
  }
  render() {
    const {
      current,
      children,
      headerRight
    } = this.props;
    return (
      <Layout
        title={current.name}
        headerLeft={this.renderHeaderLeft()}
        headerRight={headerRight}
      >
        { children }
      </Layout>
    );
  }
}

AppBase.propTypes = {
  current: PropTypes.instanceOf(File),
  children: PropTypes.node,
  headerRight: PropTypes.node,
  cd: PropTypes.func.isRequired
};

export default AppBase;
