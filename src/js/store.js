import { compose, createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
// import { createHashHistory } from 'history';
import { createBrowserHistory } from 'history';
import rootSaga from './saga';
import reducers from './reducers';

/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

// export const history = createHashHistory();
export const history = createBrowserHistory({
  basename: PUBLIC_PATH
});
const sagaMiddleware = createSagaMiddleware();

export default (() => {
  const store = createStore(
    reducers,
    composer(applyMiddleware(routerMiddleware(history), sagaMiddleware))
  );
  sagaMiddleware.run(rootSaga);
  return store;
})();
