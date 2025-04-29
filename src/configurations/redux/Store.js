import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';
import { createHashHistory } from 'history';
import thunk from 'redux-thunk';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import reducers from './RootReducer';

const history = createHashHistory();
const routeMiddleware = routerMiddleware(history);
const middlewares = [thunk, routeMiddleware];

const composeEnhancers = typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  })
  : compose;

const rootReducer = combineReducers({
  ...reducers,
  router: connectRouter(history),
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares)),
);

export {
  store, middlewares, rootReducer, history,
};
