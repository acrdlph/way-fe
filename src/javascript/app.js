import React from 'react';
import ReactDOM from 'react-dom';
import {Route} from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Onboarding from './views/onboarding';
import Profile from './views/profile';
import Login from './views/login';
import Registration from './views/registration';
import Signup from './views/signup';
import ResetPassword from './views/reset-password';
import WaitList from './views/waitlist';
import Challenge from './views/challenge';
import Chat from './views/chat';
import Feedback from './views/feedback';
import LegalNotice from './views/legal-notice';
import './app.less';

export default class App extends React.Component {
  render() {
    sessionStorage.setItem('path', this.props.location.pathname);
    return (
      <div className='app-container'>
        <Route component={Header}/>
        <div className='app-content'>
          <Route exact path="/" component={Onboarding}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/register" component={Registration}/>
          <Route exact path="/challenge" component={Challenge}/>
          <Route exact path="/profile" component={Profile}/>
          <Route exact path="/profile/:username" component={Profile}/>
          <Route exact path="/onboarding" component={Onboarding}/>
          <Route exact path="/signup" component={Signup}/>
          <Route exact path="/signup/:locationId" component={Signup}/>
          <Route exact path="/reset-password" component={ResetPassword}/>
          <Route exact path="/waitlist/" component={WaitList}/>
          <Route exact path="/waitlist/:locationId" component={WaitList}/>
          <Route exact path="/waitlist/:locationId/chat/:chatPartnerId" component={Chat}/>
          <Route exact path="/feedback" component={Feedback}/>
          <Route exact path="/legalnotice" component={LegalNotice}/>
        </div>
        <Route component={Footer}/>
      </div>
    );
  }
};
