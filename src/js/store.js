import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import reducers from './reducers';
import { routerMiddleware } from 'connected-react-router';
// import { createHashHistory as createHistory } from 'history';
import { createBrowserHistory as createHistory } from 'history';

const sagaMiddleare = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

export const history = createHistory({
  basename: process.env.PUBLIC_URL
});

const store = createStore(
  reducers(history),
  composer(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleare
    )
  )
);

sagaMiddleare.run(rootSaga).done.catch((err) => {
  console.log('Error in Sagas', err);
});

export default store;
