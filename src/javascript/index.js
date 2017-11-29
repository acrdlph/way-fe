import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {initializeGoogleAnalytics} from './util/google-analytics';
import rootReducer from './stores';
import App from './app';
import './index.less';

initializeGoogleAnalytics();

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

ReactDOM.render((
  <Provider store={store}>
    <Router>
      <MuiThemeProvider>
        <Route component={App}/>
      </MuiThemeProvider>
    </Router>
  </Provider>
), document.getElementById('root'));
