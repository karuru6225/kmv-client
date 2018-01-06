import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { HashRouter as Router, Route as PublicRoute, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

import '../css/base.scss';

import Config from './config';
import Route from './components/private-route.jsx';
import store, { history } from './store';
import { actions as commonActions } from './modules/common/action';

// import Dummy from './containers/dummy';
import Icons from './components/icons.jsx';
import Login from './containers/login';
import Directory from './containers/directory';
import Loading from './containers/loading';

store.dispatch(commonActions.init());
const syncedHistory = syncHistoryWithStore(history, store);
const theme = createMuiTheme(Config.muiTheme);

window.addEventListener('DOMContentLoaded', () => {
  render(
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router history={syncedHistory}>
          <div>
            <Loading />
            <Switch>
              <PublicRoute path="/login" component={Login} />
              <Route path="/dir" component={Directory} exact />
              <Route path="/dir/:id" component={Directory} exact />
              <Route path="/icons" component={Icons} exact />
              <Redirect from="*" to="/dir" />
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>,
    window.document.getElementById('app')
  );
});
