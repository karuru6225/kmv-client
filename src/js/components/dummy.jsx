import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import styles from './style';

const Dummy = (props) => {
  console.log(props);
  console.log(props.classes);
  return (
    <div>
      <Button
        raised
        color="primary"
        onClick={(e) => {
          e.preventDefault();
          props.goBack();
        }}
      >
        戻る
      </Button>
      <Button
        raised
        color="primary"
        onClick={(e) => {
          e.preventDefault();
          props.logout();
        }}
      >
        ログアウト
      </Button>
    </div>
  );
};

Dummy.propTypes = {
  logout: PropTypes.func.isRequired,
  goBack: PropTypes.func.isRequired,
  /* eslint react/forbid-prop-types: 0 */
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Dummy);
