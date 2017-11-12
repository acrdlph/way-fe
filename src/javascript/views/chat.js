import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import _ from 'lodash';
import ChatItem from '../components/chat-item';
import ChatInput from '../components/chat-input';
import {loadMessages} from '../stores/chatStore';

class Chat extends React.Component {

  constructor(props) {
    super(props);
    const chatPartnerId = this.props.location.state.chatPartnerId;
    const userId = sessionStorage.getItem('userId');
    console.log('show chat between ' + userId + ' and ' + chatPartnerId);
    this.sendMessage = this.sendMessage.bind(this);
    this.props.loadMessages(userId, chatPartnerId);
  }

  componentDidMount() {
    //console.log("create WebSocket connection");
    //const userId = sessionStorage.getItem('userId');
    //this.connection = new WebSocket('ws://localhost:3001/messages/'+userId);
  }

  sendMessage(message) {
    //console.log("send message: " + message);
    //this.connection.send(message);
  }

  render() {
    const chatItems = [];
    const userId = sessionStorage.getItem('userId');
    const messages = this.props.chat.data;
    const usernames = this.props.usernames;
    _.each(messages, message => {
      const isLeft = message.sender == userId;
      chatItems.push(
        <ChatItem name={usernames[message.sender]} text={message.message} left={isLeft}/>
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

const mapStateToProps = (state) => ({
  chat: state.chat,
  usernames: state.userDirectory
});

const mapDispatchToProps = dispatch => ({
  loadMessages: (userId, chatPartnerId) => dispatch(loadMessages(userId, chatPartnerId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
