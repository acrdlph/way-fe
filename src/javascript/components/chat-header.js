import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Avatar, Card } from '@material-ui/core';
import './header.less';

const createBackButton = to => (
  <NavLink to={to}>
    <span className="glyphicon glyphicon glyphicon-chevron-left" />
  </NavLink>
);
export default class ChatHeader extends React.Component {
  render() {
    const backButton = createBackButton('/waitlist');
    const photo = 'assets/avatar-placeholder.png';

    const { chatPartner } = this.props;
    const profileIcon = (
      <div className="header-chat-partner-icon">
        <Link to="/waitlist">
          <img className="logo" src="assets/icon.png" />
        </Link>
        <Avatar size={35} src={chatPartner.photo || photo} />

        <span className="header-chat-partner-username">{chatPartner.name}</span>
      </div>
    );
    return (
      <Card className="header">
        <div className="header-back-button">{backButton}</div>
        {profileIcon}
      </Card>
    );
  }
}
