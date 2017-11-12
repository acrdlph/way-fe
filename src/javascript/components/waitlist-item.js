import React from 'react';
import {NavLink} from 'react-router-dom';
import {ListItem} from 'material-ui/List';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';

export default class WaitListItem extends React.Component {
  render() {
    let {interests, name, timeLeft, hasChat, onClick} = this.props;
    if(interests.trim() === '') {
      interests = 'No information available';
    }
    if(name.trim() === '') {
      name = 'No name specified';
    }
    let secondaryText = name;
    if(timeLeft !== undefined) {
      secondaryText = `${name} (${timeLeft} min)`;
    }
    return (
      <ListItem
        primaryText={interests}
        secondaryText={secondaryText}
        rightIcon={hasChat ? <CommunicationChatBubble/> : null}
        onClick={onClick}
      />
    );
  }
}
