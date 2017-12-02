import React from 'react';
import {NavLink} from 'react-router-dom';
import {Card} from 'material-ui/Card';
import './header.less';

export default class Header extends React.Component {
  render() {

    const {pathname} = this.props.location;
    const isInWaitlist = pathname.includes('waitlist');
    const isInSignup = pathname.includes('signup');
    const isInLogin = pathname.includes('login');
    const isInRegistration = pathname.includes('register');
    const isInChat = pathname.includes('chat');

    if(!(isInWaitlist || isInSignup || isInLogin || isInRegistration)) {
      return null;
    }

    const backButton = isInChat ? (
      <div className='header-back-button'>
        <NavLink to="/waitlist">
          <span className="glyphicon glyphicon glyphicon-chevron-left"/>
        </NavLink>
      </div>
    ) : null;

    return (
      <Card className='header'>
        {backButton}
        <img
          className='logo'
          src='assets/waitlistlogo.svg'
        />
      </Card>
    );
  }
}
