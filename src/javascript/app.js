import React from 'react';
import ReactDOM from 'react-dom';
import {Route} from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Onboarding from './views/onboarding';
import Signup from './views/signup';
import WaitList from './views/waitlist';
import Chat from './views/chat';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <div>
          <Route exact path="/" component={Onboarding}/>
          <Route exact path="/onboarding" component={Onboarding}/>
          <Route exact path="/signup" component={Signup}/>
          <Route exact path="/signup/:locationId" component={Signup}/>
          <Route exact path="/waitlist/" component={WaitList}/>
          <Route exact path="/waitlist/:locationId" component={WaitList}/>
          <Route exact path="/waitlist/:locationId/chat/:chatPartnerId" component={Chat}/>
        </div>
        <Footer/>
      </div>
    );
  }
};
