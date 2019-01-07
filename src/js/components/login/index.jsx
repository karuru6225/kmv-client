import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '400px',
    margin: '100px auto'
  },
  textField: {
    marginBottom: theme.spacing.unit,
  },
  forgotPassword: {
    marginTop: theme.spacing.unit * 2,
    textAlign: 'center',
  }
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.userRef = React.createRef();
    this.passRef = React.createRef();
  }

  render() {
    const {
      classes,
      sending,
      login,
      errorMessage
    } = this.props;
    const isError = errorMessage !== '';
    return (
      <div>
        <form className={classes.loginForm}>
          <TextField
            error={isError}
            id="username"
            label={isError ? errorMessage : 'username'}
            inputRef={this.userRef}
            disabled={sending}
            className={classes.textField}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            inputRef={this.passRef}
            disabled={sending}
            className={classes.textField}
          />
          <Button
            variant="contained"
            color="primary"
            disabled={sending}
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              login(
                this.userRef.current.value,
                this.passRef.current.value,
              );
            }}
          >
            ログイン
          </Button>
        </form>
      </div>
    );
  }
}


Login.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  login: PropTypes.func.isRequired,
  sending: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired
};

export default withStyles(styles)(Login);
