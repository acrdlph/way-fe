import React from 'react';
import {NavLink} from 'react-router-dom';
import './chat-header.less';

export default class ChatHeader extends React.Component {

  render() {
    return (
      <div className='chat-header container'>
        <ol class="chat-header-breadcrumb breadcrumb">
          <li class="breadcrumb-item"><NavLink to="/waitlist">WaitList</NavLink></li>
          <li class="breadcrumb-item active">Chat</li>
          <img
            className='chat-header-logo'
            src='assets/waitlistlogo.svg'
          />
        </ol>
      </div>
    );
  }
}
