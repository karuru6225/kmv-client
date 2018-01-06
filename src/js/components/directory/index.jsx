import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Measure from 'react-measure';

import Table from './table.jsx';
import File from '../../models/file';
import styles from './style';

class Directory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
      appBarHeight: 48,
      windowSize: {
        width: 100,
        height: 100
      }
    };
  }

  componentDidMount() {
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
    // });
  }

  handleDrawerOpen = () => {
    this.setState({
      drawerOpen: true
    });
  }

  handleDrawerClose = () => {
    this.setState({
      drawerOpen: false
    });
  }

  renderDrawer() {
    const { classes } = this.props;
    return (
      <Drawer
        type="persistent"
        open={this.state.drawerOpen}
        classes={{
          paper: classes.drawer
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem
            button
            onClick={() => {
              this.props.refresh(this.props.current.id);
              this.handleDrawerClose();
            }}
          >
            <ListItemText primary="更新" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="test2" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="test3" />
          </ListItem>
          <ListItem button onClick={this.props.logout}>
            <ListItemText primary="ログアウト" />
          </ListItem>
        </List>
      </Drawer>
    );
  }

  render() {
    const { classes, handleSelected } = this.props;
    const tableHeight = this.state.windowSize.height - this.state.appBarHeight;
    return (
      <div>
        <AppBar
          className={
            classNames(classes.appBar, {
              [classes.appBarShift]: this.state.drawerOpen
            })
          }
        >
          <Toolbar disableGutters={!this.state.drawerOpen} >
            <IconButton
              color="contrast"
              aria-label="open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(
                classes.menuButton,
                { [classes.hide]: this.state.drawerOpen }
              )}
            >
              <MenuIcon />
            </IconButton>
            <Button
              onClick={() => {
                this.props.handleSelected({
                  id: this.props.current.parentId
                });
              }}
              className={classNames(classes.parentButton)}
            >
              ../
            </Button>
            <Typography type="title" color="inherit">
              { this.props.current.name }
            </Typography>
          </Toolbar>
        </AppBar>
        <Measure
          bounds
          onResize={(contentRect) => {
            this.setState({ appBarHeight: contentRect.bounds.height });
          }}
        >
          {({ measureRef }) => (
            <div ref={measureRef} className={classNames(classes.contentSpacer)} />
          )}
        </Measure>
        { this.renderDrawer() }
        <Table files={this.props.files} height={tableHeight} onSelected={handleSelected} />
      </div>
    );
  }
}

Directory.propTypes = {
  current: PropTypes.instanceOf(File).isRequired,
  files: PropTypes.arrayOf(PropTypes.instanceOf(File)).isRequired,
  // loading: PropTypes.bool.isRequired,
  handleSelected: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  /* eslint react/forbid-prop-types: 0 */
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Directory);
