import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    zIndex: theme.zIndex.tooltip + 100
  }
});

const Loading = (props) => {
  const { classes, loading } = props;
  if (loading) {
    return (
      <div
        className={classes.loadingContainer}
      >
        <CircularProgress />
      </div>
    );
  }
  return null;
};

Loading.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  loading: PropTypes.bool.isRequired
};

export default withStyles(styles)(Loading);
