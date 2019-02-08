import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import NextIcon from '@material-ui/icons/SkipNext';
import StopIcon from '@material-ui/icons/Stop';
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
  },
  stopButton: {
    marginLeft: theme.spacing.unit
  }
});


class AppBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false
    };
  }

  handleKey = (e) => {
    const {
      next_bookmark,
      isPlaying,
    } = this.props;
    switch(e.keyCode) {
      case  190: { // >
        if (isPlaying) {
          next_bookmark();
        }
        break;
      }
      default: {
        // console.log(e.keyCode);
      }
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKey);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKey);
  }

  renderHeaderLeft() {
    const {
      cd,
      current,
      next_bookmark,
      stop_play_bookmark,
      isPlaying,
      classes,
    } = this.props;
    const buttons = [
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
    if (isPlaying) {
      buttons.push(
        <IconButton
          key='next'
          color="inherit"
          onClick={next_bookmark}
        >
          <NextIcon />
        </IconButton>
      );
      buttons.push(
        <IconButton
          key='next'
          color="inherit"
          className={classes.stopButton}
          onClick={stop_play_bookmark}
        >
          <StopIcon />
        </IconButton>
      );
    }
    return buttons;
  }
  toggleDrawer = (open) => () => {
    this.setState({
      drawerOpen: open
    });
  }

  renderMenuLists () {
    const {
      classes,
      show_progress,
      buffered,
      current,
      max_pos
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
        <List>
          <Link
            className={classes.listItemLink}
            to="/bookmark"
          >
            <ListItem button>
              <ListItemText
                primary="ブックマーク"
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
      headerRight,
      current_pos,
      max_pos
    } = this.props;
    const title = max_pos > 0 && isFinite(current_pos) ? `${current.name} (${current_pos + 1} / ${max_pos})` : current.name;
    return (
      <div>
        <Layout
          title={title}
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
  cd: PropTypes.func.isRequired,
  next_bookmark: PropTypes.func.isRequired,
  stop_play_bookmark: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  current_pos: PropTypes.number,
  max_pos: PropTypes.number,
};

AppBase.defaultProps = {
  current: 0,
  max_pos: 0
};

export default withStyles(styles)(AppBase);
