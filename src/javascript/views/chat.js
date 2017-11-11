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
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    console.log("create WebSocket connection");
    this.connection = new WebSocket('ws://localhost:3001');
  }

  sendMessage(message) {
    console.log("send message: " + message);
    this.connection.send(message);
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

    const connection = this.connection;
    return (
      <div style={{width: '400px'}}>
        {chatItems}
        <ChatInput onSend={this.sendMessage}/>
      </div>
    );
  }
}
