import "babel-polyfill";
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import store, { history } from './store';
import Dummy from './containers/dummy';
import Auth from './containers/auth';
import Loading from './containers/loading';
import Login from './containers/login';
import Directory from './containers/directory';
import { storage, storageKey, extComponentMap } from './utils/consts';
import { actions as authActions } from './modules/auth/action';

const token = storage.getItem(storageKey);
if (token) {
  store.dispatch( authActions.login_success(token) );
}

const componentsMap = [];
extComponentMap.forEach((app) => {
  app.exts.forEach((ext) => {
    componentsMap.push(
      (
        <Route extact key={app.key} path={`/${ext}/*`} component={app.component} />
      )
    );
  });
});

window.addEventListener('DOMContentLoaded', () => {
  render(
    <Provider store={store}>
      <Router history={history}>
        <div>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Auth>
              <Switch>
                <Route exact path="/"
                  render={props =>(
                    <Directory {...props} column_type="dir" />
                    )}
                />
                <Route exact path="/directory"
                  render={props =>(
                    <Directory {...props} column_type="dir" />
                    )}
                />
                <Route exact path="/history"
                  render={props =>(
                    <Directory {...props} column_type="history" />
                    )}
                />
                <Route exact path="/directory/:id"
                  render={props =>(
                    <Directory {...props} column_type="dir" />
                    )}
                />
                <Route exact path="/bookmark"
                  render={props =>(
                    <Directory {...props} column_type="bookmark-list" />
                    )}
                />
                <Route exact path="/bookmark/:id"
                  render={props =>(
                    <Directory {...props} column_type="bookmark" />
                    )}
                />
                { componentsMap }
                <Route path="*" component={Dummy} />
              </Switch>
            </Auth>
          </Switch>
          <Loading />
        </div>
      </Router>
    </Provider>,
    window.document.getElementById('root')
  );
});
