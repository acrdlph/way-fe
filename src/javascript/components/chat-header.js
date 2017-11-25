import React from 'react';
import {NavLink} from 'react-router-dom';
import './chat-header.less';

export default class ChatHeader extends React.Component {

  render() {
    const chatParnerName = this.props.chatParnerName;
    let chatLabel = '';
    if(chatParnerName) {
      chatLabel = `Chat with ${chatParnerName}`;
    }
    return (
      <div className='chat-header container'>
        <div class='chat-header-back-button'>
          <NavLink to="/waitlist">
            <span class="glyphicon glyphicon-chevron-left"/>
            <span class="glyphicon glyphicon-chevron-left"/>
            <span class="glyphicon glyphicon-chevron-left"/>
          </NavLink>
        </div>
        {chatLabel}
        <img
          className='chat-header-logo'
          src='assets/waitlistlogo.svg'
        />
      </div>
    );
  }
}
