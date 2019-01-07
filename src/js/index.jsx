import "babel-polyfill";
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter as Router } from 'connected-react-router';
import moment from 'moment';
import filesize from 'filesize';
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

const dirColumns = [
  {
    Header: 'Name',
    id: 'name',
    accessor: 'name'
  },
  {
    Header: '更新日時',
    id: 'mtime',
    width: 200,
    resizable: false,
    accessor: f => moment(f.mtime).utcOffset(9).format('YYYY/MM/DD HH:mm:ss')
  },
  {
    Header: 'サイズ',
    id: 'size',
    accessor: 'size',
    Cell: r => filesize(r.value),
    width: 120,
    style: {
      'textAlign': 'right'
    }
  }
];

const historyColumns = [
  {
    Header: 'Name',
    id: 'name',
    accessor: 'name'
  },
  {
    Header: 'Index',
    id: 'index',
    width: 100,
    accessor: 'index'
  },
  {
    Header: '更新日時',
    id: 'mtime',
    width: 200,
    resizable: false,
    accessor: f => moment(f.mtime).utcOffset(9).format('YYYY/MM/DD HH:mm:ss')
  },
  {
    Header: 'サイズ',
    id: 'size',
    accessor: 'size',
    Cell: r => filesize(r.value),
    width: 120,
    style: {
      'textAlign': 'right'
    }
  }
];


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
                    <Directory {...props} columns={dirColumns} />
                    )}
                />
                <Route exact path="/directory"
                  render={props =>(
                    <Directory {...props} columns={dirColumns} />
                    )}
                />
                <Route exact path="/history"
                  render={props =>(
                    <Directory {...props} columns={historyColumns} />
                    )}
                />
                <Route exact path="/directory/:id"
                  render={props =>(
                    <Directory {...props} columns={dirColumns} />
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
