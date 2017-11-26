import React from 'react';
import {NavLink} from 'react-router-dom';
import {Card} from 'material-ui/Card';
import './header.less';

export default class Header extends React.Component {
  render() {

    const isInChat = this.props.location.pathname.includes('chat');
    const backButton = isInChat ? (
      <div className='header-back-button'>
        <NavLink to="/waitlist">
          <span className="glyphicon glyphicon glyphicon-arrow-left"/>
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
