import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { createHashHistory } from 'history';
import rootSaga from './saga';
import reducers from './reducers';

/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

export const history = createHashHistory();
const sagaMiddleware = createSagaMiddleware();

export default (() => {
  const store = createStore(
    reducers,
    {
      routing: routerReducer,
    },
    composer(applyMiddleware(routerMiddleware(history), sagaMiddleware))
  );
  sagaMiddleware.run(rootSaga);
  return store;
})();
