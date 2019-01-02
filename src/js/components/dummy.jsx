import React from 'react';
import { Link } from 'react-router-dom';
import { withTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

class Dummy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      to: 'directory'
    };
  }

  render() {
    const {
      theme
    } = this.props;
    const variants = Object.keys(theme.typography)
      .filter(t => (typeof theme.typography[t]) === 'object')
      .filter(t => !t.match(/.*Next/))
    return (
      <div>
        <div>
          ダミーコンポーネント
        </div>
        <div>
          <Link to="/login">
            ログイン画面へ
          </Link>
        </div>
        <div>
          <Link to="/logout">
            ログアウト
          </Link>
        </div>
        <div>
          <Link to={`/${this.state.to}`}>
            {`/${this.state.to}`}
          </Link>
        </div>
        <div>
          <TextField
            label='to'
            value={this.state.to}
            onChange={e => this.setState({to: e.target.value})}
          />
        </div>
        {
          variants.map(v => (
            <Typography variant={v} key={v}>
              {v}
            </Typography>
          ))
        }
      </div>
    );
  }
}

export default withTheme()(Dummy);
