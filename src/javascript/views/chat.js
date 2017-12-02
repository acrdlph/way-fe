import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import _ from 'lodash';
import {trackPageView, trackEvent, events} from '../util/google-analytics';
import ChatInput from '../components/chat-input';
import Conversation from '../components/conversation';
import {loadMessages, addMessagesToChat} from '../stores/chatStore';
import {initWebSocketStore, getWebSocketConnection} from '../stores/webSocketStore';
import './chat.less';

class Chat extends React.Component {

  constructor(props) {
    super(props);

    const path = this.props.location.pathname;
    const chatPathWithoutPartnerId = path.substring(0, path.indexOf("/chat")+5);
    trackPageView(chatPathWithoutPartnerId);

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
    const chatPartnerId = _.get(this.props.match, 'params.chatPartnerId');
    const userId = sessionStorage.getItem('userId');
    const addMessages = this.props.addMessagesToChat;
    initWebSocketStore(userId, function (event) {
      console.log("receive websocket message: " + JSON.stringify(event.data));
      const message = JSON.parse(event.data);
      addMessages([message], chatPartnerId);
      const path = sessionStorage.getItem('path');
      if(path.includes('chat')) {
        window.scrollTo(0, document.body.scrollHeight);
      }
      if(message.sender_id !== userId) {
        trackEvent(events.USER_RECEIVED_MESSAGE);
      }
    });
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
    getWebSocketConnection().send(payloadString);
    trackEvent(events.USER_SEND_MESSAGE);
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
    const userlist = this.props.userlist;
    const messages = this.props.chat.data;
    const chatParnerName = userlist[chatPartnerId].name;
    return (
      <div className='chat'>
        <div className='chat-content'>
          <Conversation user={userId} userPhoto={this.props.userPhoto} users={userlist} messages={messages}/>
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
  userlist: state.userDirectory
});

const mapDispatchToProps = dispatch => ({
  loadMessages: (userId, chatPartnerId) => dispatch(loadMessages(userId, chatPartnerId)),
  addMessagesToChat: (messages, chatPartnerId) => dispatch(addMessagesToChat(messages, chatPartnerId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
