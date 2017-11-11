import React from 'react';
import {Button} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';
import _ from 'lodash';
import ChatItem from '../components/chat-item';
import ChatInput from '../components/chat-input';

export default class Chat extends React.Component {

  constructor(props) {
    super(props);
    const chatPartnerId = this.props.location.state.chatPartnerId;
    const userId = sessionStorage.getItem('userId');
    console.log('show chat between ' + userId + ' and ' + chatPartnerId);
    this.state = {
      chatPartnerId,
      userId,
      messages: [
        {
          author: 2,
          text: 'Hi!'
        },
        {
          author: 123,
          text: 'Hello! How are you?'
        },
        {
          author: 2,
          text: 'Fine and you?'
        }
      ]
    };
  }

  render() {
    const chatItems = [];
    const {messages, userId} = this.state;
    _.each(messages, message => {
      const isLeft = message.author == userId;
      chatItems.push(
        <ChatItem text={message.text} left={isLeft}/>
      );
    });

    return (
      <div style={{width: '400px'}}>
        {chatItems}
        <ChatInput onSend={(message) => {console.log(message);}}/>
      </div>
    );
  }
}
