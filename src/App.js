import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import store, { history } from './store';
import logo from './logo.svg';
import Dummy from './components/dummy.jsx';
import Login from './containers/login.js';

export default () => (
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Switch>
          <Route path="/login" component={Login}/>
          <Route path="*" component={Dummy}/>
        </Switch>
        <img src={logo} className="App-logo" alt="logo" />
      </div>
    </Router>
  </Provider>
);
