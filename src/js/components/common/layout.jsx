import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  toolbar: {
    justifyContent: 'space-between'
  },
  left: {
    marginLeft: -18,
    marginRight: theme.spacing.unit,
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center'
  },
  right: {
    marginLeft: theme.spacing.unit,
    marginRight: -18,
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center'
  }
});

const Layout = (props) => {
  const {
    classes,
    title,
    headerLeft,
    headerRight,
    children,
    show_appbar
  } = props;
  return (
    <div className={classes.root}>
      {(() => {
        if (show_appbar) {
          return (
            <AppBar position="static">
              <Toolbar variant="dense" className={classes.toolbar}>
                <div className={classes.left}>
                  { headerLeft }
                </div>
                <Typography variant="h6" color="inherit" noWrap>
                  { title }
                </Typography>
                <div className={classes.right}>
                  { headerRight }
                </div>
              </Toolbar>
            </AppBar>
          );
        }
      })()}
      <div>
        { children }
      </div>
    </div>
  );
}

Layout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node,
  title: PropTypes.string,
  headerLeft: PropTypes.node,
  headerRight: PropTypes.node,
  show_appbar: PropTypes.bool,
};

Layout.defaultProps = {
  title: '',
  show_appbar: true
};

export default withStyles(styles)(Layout);
