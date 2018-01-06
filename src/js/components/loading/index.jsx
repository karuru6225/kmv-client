import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import styles from './style';

const Loading = props => (
  <div
    className={
      classNames({
        [props.classes.center]: props.loading,
        [props.classes.hide]: !props.loading
      })
    }
  >
    <CircularProgress className={classNames(props.classes.progress)} />
  </div>
);

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  /* eslint react/forbid-prop-types: 0 */
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Loading);
