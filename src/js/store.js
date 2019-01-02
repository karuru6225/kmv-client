import { compose, createStore, applyMiddleware } from 'redux';
import persistState from 'redux-sessionstorage';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas';
import reducers from './reducers';
import { routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';

const sagaMiddleare = createSagaMiddleware();

/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

export const history = createHashHistory();

const store = createStore(
  reducers(history),
  composer(
    applyMiddleware(
      routerMiddleware(history),
      sagaMiddleare
    ),
    persistState()
  )
);

sagaMiddleare.run(rootSaga).done.catch((err) => {
  console.log('Error in Sagas', err);
});

export default store;
