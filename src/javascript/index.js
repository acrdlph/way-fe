import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {HashRouter as Router, Route, Link} from 'react-router-dom';
import Onboarding from './views/onboarding';
import Signup from './views/signup';
import WaitList from './views/waitlist';
import Chat from './views/chat';
import rootReducer from './stores';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

ReactDOM.render((
  <Provider store={store}>
    <Router>
      <MuiThemeProvider>
        <Route exact path="/" component={Onboarding}/>
        <Route path="/onboarding" component={Onboarding}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/waitlist" component={WaitList}/>
        <Route path="/chat" component={Chat}/>
      </MuiThemeProvider>
    </Router>
  </Provider>
), document.getElementById('root'));
