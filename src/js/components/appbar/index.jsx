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

import File from '../../models/file';
import styles from './style';

class MyAppBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawerOpen: false,
    };
  }

  handleChangeBarHeight = (contentRect) => {
    this.props.onChangeHeight(contentRect.bounds.height);
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
          { this.props.children }
          <ListItem button onClick={this.props.logout}>
            <ListItemText primary="ログアウト" />
          </ListItem>
        </List>
      </Drawer>
    );
  }

  render() {
    const { classes, gotoParent } = this.props;
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
              color="inherit"
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
                gotoParent(this.props.current.parentId);
              }}
              disabled={this.props.current.id === ''}
              className={classNames(classes.parentButton)}
            >
              ../
            </Button>
            <Typography type="title" color="inherit">
              { this.props.current.name }
            </Typography>
          </Toolbar>
        </AppBar>
        <Measure bounds onResize={this.handleChangeBarHeight}>
          {({ measureRef }) => (
            <div ref={measureRef} className={classNames(classes.contentSpacer)} />
          )}
        </Measure>
        { this.renderDrawer() }
      </div>
    );
  }
}

MyAppBar.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  current: PropTypes.shape(File.shape).isRequired,
  gotoParent: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  onChangeHeight: PropTypes.func.isRequired,
  /* eslint react/forbid-prop-types: 0 */
  classes: PropTypes.object.isRequired,
};

MyAppBar.defaultProps = {
  children: []
};

export default withStyles(styles, { withTheme: true })(MyAppBar);
