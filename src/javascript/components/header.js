import React from 'react';
import {NavLink} from 'react-router-dom';
import {Card} from 'material-ui/Card';
import './header.less';

export default class Header extends React.Component {
  render() {

    const isInWaitlist = this.props.location.pathname.includes('waitlist');
    const isInSignup = this.props.location.pathname.includes('signup');
    const isInChat = this.props.location.pathname.includes('chat');
    const isInFeedback = this.props.location.pathname.includes('feedback');

    if(!(isInWaitlist || isInSignup || isInFeedback)) {
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
