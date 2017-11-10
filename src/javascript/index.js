import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Onboarding from './views/onboarding';
import Signup from './views/signup';
import WaitList from './views/waitlist';
import Chat from './views/chat';
import {
  HashRouter as Router,
  Route,
  Link
} from 'react-router-dom'

ReactDOM.render((
  <Router>
    <MuiThemeProvider>
      <Route exact path="/" component={Onboarding}/>
      <Route path="/onboarding" component={Onboarding}/>
      <Route path="/signup" component={Signup}/>
      <Route path="/waitlist" component={WaitList}/>
      <Route path="/chat" component={Chat}/>
    </MuiThemeProvider>
  </Router>
), document.getElementById('root'));
