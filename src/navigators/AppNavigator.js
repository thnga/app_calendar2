import {
    reduxifyNavigator,
    createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import {
    createStore,
    applyMiddleware,
} from 'redux';
import {
    connect
} from 'react-redux';
import Router from './Router';
import appReducer from '../reducers';

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__ }); // eslint-disable-line
const middleware = createReactNavigationReduxMiddleware(
    "root", state => state.nav
);

const App = reduxifyNavigator(Router, "root");
const mapStateToProps = (state) => ({
  state: state.nav,
});

export default AppNavigator = connect(mapStateToProps)(App);

export const store = createStore(
    appReducer,
    applyMiddleware(loggerMiddleware, thunk)
);