import React from 'react';
import {NavLink} from 'react-router-dom';
import {Card} from 'material-ui/Card';
import './header.less';

const PAGES_WITH_HEADER = ['waitlist', 'signup', 'login', 'challenge', 'register', 'chat', 'profile'];

export default class Header extends React.Component {
  render() {

    const {pathname} = this.props.location;
    const isHeaderVisible = _.filter(PAGES_WITH_HEADER, page => pathname.includes(page)).length > 0;
    if(!isHeaderVisible) {
      return null;
    }

    const isInChat = pathname.includes('chat');
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
