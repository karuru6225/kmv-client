import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import Drawer from '@material-ui/core/Drawer';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import File from '../../models/file';
import Layout from '../common/layout.jsx';

const styles = (theme) => ({
  list: {
    width: '200px'
  },
  listItemLink: {
    textDecoration: 'none !important'
  }
});


class AppBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    };
  }
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
        onClick={this.toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>
    ];
  }
  toggleDrawer = (open) => () => {
    this.setState({
      drawerOpen: open
    });
  }
  renderMenuLists () {
    const {
      classes
    } = this.props;
    return (
      <div className={classes.list}>
        <List>
          <Link
            className={classes.listItemLink}
            to="/history"
          >
            <ListItem button>
              <ListItemText
                primary="履歴"
              />
            </ListItem>
          </Link>
        </List>
        <Divider />
        <List>
          <Link
            className={classes.listItemLink}
            to="/logout"
          >
            <ListItem button>
              <ListItemText
                className={classes.listItemText}
                primary="ログアウト"
              />
            </ListItem>
          </Link>
        </List>
      </div>
    );
  }
  render() {
    const {
      current,
      children,
      headerRight
    } = this.props;
    return (
      <div>
        <Layout
          title={current.name}
          headerLeft={this.renderHeaderLeft()}
          headerRight={headerRight}
        >
          { children }
        </Layout>
        <Drawer
          open={this.state.drawerOpen}
          onClose={this.toggleDrawer(false)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer(false)}
            onKeyDown={this.toggleDrawer(false)}
          >
            {this.renderMenuLists()}
          </div>
        </Drawer>
      </div>
    );
  }
}

AppBase.propTypes = {
  classes: PropTypes.object.isRequired,
  current: PropTypes.instanceOf(File),
  children: PropTypes.node,
  headerRight: PropTypes.node,
  cd: PropTypes.func.isRequired
};

export default withStyles(styles)(AppBase);
