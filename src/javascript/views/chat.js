import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import _ from 'lodash';
import ChatInput from '../components/chat-input';
import Conversation from '../components/conversation';
import {loadMessages, addMessagesToChat} from '../stores/chatStore';
import './chat.less';

class Chat extends React.Component {

  constructor(props) {
    super(props);

    const userId = sessionStorage.getItem('userId');
    const chatPartnerId = _.get(this.props.match, 'params.chatPartnerId');
    if(userId && chatPartnerId) {
      console.log('show chat between ' + userId + ' and ' + chatPartnerId);
      this.props.loadMessages(userId, chatPartnerId);
    } else {
      this.props.history.push("/signup");
    }

    this.sendMessage = this.sendMessage.bind(this);
  }

  componentDidMount() {
    console.log("create WebSocket connection");
    const userId = sessionStorage.getItem('userId');
    const chatPartnerId = _.get(this.props.match, 'params.chatPartnerId');
    this.connection = new WebSocket(WEBSOCKET_BASE_URL+userId);
    const addMessages = this.props.addMessagesToChat;
    this.connection.onmessage = function (event) {
      console.log("receive websocket message: " + JSON.stringify(event.data));
      addMessages([JSON.parse(event.data)], chatPartnerId);
      const path = sessionStorage.getItem('path');
      if(path.includes('chat')) {
        window.scrollTo(0, document.body.scrollHeight);
      }
    };
  }

  sendMessage(message) {
    const chatPartnerId = _.get(this.props.match, 'params.chatPartnerId');
    const userId = sessionStorage.getItem('userId');
    const payload = {
      message,
      sender_id: userId,
      receiver_id: chatPartnerId
    };
    const payloadString = JSON.stringify(payload);
    console.log("send message: " + payloadString);
    this.connection.send(payloadString);
    /*
    // this only works if server and client time are the same...
    this.props.addMessagesToChat([{
      ...payload,
      created_at: new Date()
    }]);
    */
  }

  render() {
    const chatItems = [];
    const userId = sessionStorage.getItem('userId');
    const chatPartnerId = _.get(this.props.match, 'params.chatPartnerId');
    const usernames = this.props.usernames;
    const messages = this.props.chat.data;
    const connection = this.connection;
    const chatParnerName = usernames[chatPartnerId];
    return (
      <div className='chat'>
        <div className='chat-content'>
          <Conversation user={userId} userPhoto={this.props.userPhoto} users={usernames} messages={messages}/>
        </div>
        <div className='chat-chat-input'>
          <ChatInput onSend={this.sendMessage}/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  chat: state.chat,
  userPhoto: state.user.data.photo,
  usernames: state.userDirectory
});

const mapDispatchToProps = dispatch => ({
  loadMessages: (userId, chatPartnerId) => dispatch(loadMessages(userId, chatPartnerId)),
  addMessagesToChat: (messages, chatPartnerId) => dispatch(addMessagesToChat(messages, chatPartnerId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
