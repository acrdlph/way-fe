import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { white, green } from '@material-ui/core/colors/';
import { initializeGoogleAnalytics } from './util/google-analytics';
import rootReducer from './stores';
import App from './app';
import './index.less';

initializeGoogleAnalytics();

let composeExtensions = compose;
if (DEVELOPMENT_MODE && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
  composeExtensions = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
}

const theme = createMuiTheme({
  palette: {
    primary: white,
    secondary: green,
  },
  status: {
    danger: 'orange',
  },
});

const store = createStore(rootReducer, composeExtensions(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <MuiThemeProvider theme={theme}>
        <Route component={App} />
      </MuiThemeProvider>
    </Router>
  </Provider>,
  document.getElementById('root'),
);
