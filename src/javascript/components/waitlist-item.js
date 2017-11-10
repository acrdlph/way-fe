import React from 'react';
import {Button} from 'react-bootstrap'
import {NavLink} from 'react-router-dom'
import {ListItem} from 'material-ui/List';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

export default class WaitListItem extends React.Component {
  render() {
    let {interests, hasChat, onClick} = this.props;
    if(interests.trim() === '') {
      interests = 'No information available';
    }
    return (
      <ListItem
        primaryText={interests}
        rightIcon={hasChat ? <CommunicationChatBubble/> : null}
        onClick={onClick}
      />
    );
  }
}
