import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Router, Route as PublicRoute, Switch } from 'react-router-dom';
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
import { extComponentMap } from './utils/consts';

const syncedHistory = syncHistoryWithStore(history, store);
const theme = createMuiTheme(Config.muiTheme);

const apps = Object.keys(extComponentMap).filter(k => k !== 'dir');

window.addEventListener('DOMContentLoaded', () => {
  store.dispatch(commonActions.init());
  render(
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router history={syncedHistory}>
          <div>
            <Loading />
            <Switch>
              <PublicRoute path="/login" component={Login} />
              <Route exact path="/" component={Directory} />
              <Route exact path="/directory" component={Directory} />
              <Route exact path="/directory/:id" component={Directory} />
              <Route exact path="/icons" component={Icons} />
              {
                apps.map((app) => {
                  const { component: Component, exts } = extComponentMap[app];
                  return exts.map((ext) => {
                    const boundComponent = props => (
                      <Component {...props} ext={ext} />
                    );
                    return (
                      <Route
                        key={`${app}-${ext}`}
                        path={`/${ext}/:id`}
                        component={boundComponent}
                      />
                    );
                  });
                })
              }
            </Switch>
          </div>
        </Router>
      </Provider>
    </MuiThemeProvider>,
    window.document.getElementById('app')
  );
});
