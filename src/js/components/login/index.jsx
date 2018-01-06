import React from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import styles from './style';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  render() {
    return (
      <form className={this.props.classes.container}>
        <TextField
          label="Username"
          placeholder="Username"
          onChange={(e) => {
            this.setState({ username: e.target.value });
          }}
          value={this.state.username}
          fullWidth
        />
        <TextField
          label="Password"
          placeholder="Password"
          type="password"
          onChange={(e) => {
            this.setState({ password: e.target.value });
          }}
          value={this.state.password}
          fullWidth
        />
        <Button
          raised
          type="submit"
          color="primary"
          onClick={(e) => {
            e.preventDefault();
            this.props.login(
              this.state.username,
              this.state.password,
              this.props.location.state
            );
          }}
          disabled={this.props.sending}
          className={this.props.classes.button}
        >
          ログイン
        </Button>
      </form>
    );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  sending: PropTypes.bool.isRequired,
  /* eslint react/forbid-prop-types: 0 */
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Login);
