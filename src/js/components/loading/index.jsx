import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import styles from './style';

const Loading = props => (
  <div
    className={
      classNames({
        [props.classes.hide]: !props.loading,
        [props.classes.container]: props.loading,
      })
    }
  >
    <LinearProgress color="secondary" />
  </div>
);

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  /* eslint react/forbid-prop-types: 0 */
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Loading);
