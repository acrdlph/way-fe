import React from 'react';
import {NavLink} from 'react-router-dom';
import {Card} from 'material-ui/Card';
import './header.less';

const createBackButton = (to) => {
  return (
    <div className='header-back-button'>
      <NavLink to={to}>
        <span className="glyphicon glyphicon glyphicon-chevron-left"/>
      </NavLink>
    </div>
  );
};

export default class Header extends React.Component {
  render() {

    const isInWaitlist = this.props.location.pathname.includes('waitlist');
    const isInSignup = this.props.location.pathname.includes('signup');
    const isInChat = this.props.location.pathname.includes('chat');
    const isInFeedback = this.props.location.pathname.includes('feedback');

    if(!(isInWaitlist || isInSignup || isInFeedback)) {
      return null;
    }

    let backButton = null;
    if(isInChat) {
      backButton = createBackButton('/waitlist');
    };
    if(isInFeedback) {
      backButton = createBackButton('/');
    };

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
