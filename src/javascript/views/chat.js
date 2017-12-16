import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import LinearProgress from 'material-ui/LinearProgress';
import {trackPageView, trackEvent, events} from '../util/google-analytics';
import ChatInput from '../components/chat-input';
import Conversation from '../components/conversation';
import {loadMessages, addMessagesToChat} from '../stores/chatStore';
import {initWebSocketStore, send} from '../stores/webSocketStore';
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
    this.onMessageUpdate = this.onMessageUpdate.bind(this);
    this.enableChat = this.enableChat.bind(this);
    this.disableChat = this.disableChat.bind(this);
    this.state = {
      disableChat: false
    };
  }

  componentDidMount() {
    console.log("create WebSocket connection");
    const userId = sessionStorage.getItem('userId');
    initWebSocketStore(userId, /* new message */ this.onMessageUpdate, () => {
      // connected
      this.enableChat();
    }, () => {
      // connection closed
      this.disableChat();
    });
  }

  onMessageUpdate(message) {
    const chatPartnerId = _.get(this.props.match, 'params.chatPartnerId');
    const userId = sessionStorage.getItem('userId');
    this.props.addMessagesToChat([message], chatPartnerId);
    const path = sessionStorage.getItem('path');
    if(path.includes('chat')) {
      window.scrollTo(0, document.body.scrollHeight);
    }
    if(message.sender_id !== userId) {
      trackEvent(events.USER_RECEIVED_MESSAGE);
    }
  }

  enableChat() {
    this.setState({
      disableChat: false
    });
  }

  disableChat() {
    this.setState({
      disableChat: true
    });
  }

  /**
   * Problem: user should get some feedback on non delivered messages
   * @param {*} message 
   */
  async sendMessage(message) {
    const chatPartnerId = _.get(this.props.match, 'params.chatPartnerId');
    const userId = sessionStorage.getItem('userId');
    const payload = {
      local_id: uuidv4(),
      message,
      sender_id: userId,
      receiver_id: chatPartnerId
    };
    const success = await send(payload);
    if (!success) {
      // add messages locally
      // set local time as created_at as the server did not get to generate it.
      // when the server responds it will send the corret created_at, triggering a reorder
      payload.created_at = new Date();
      this.onMessageUpdate(payload);
    }
    trackEvent(events.USER_SEND_MESSAGE);
  }

  render() {
    const chatItems = [];
    const userId = sessionStorage.getItem('userId');
    const chatPartnerId = _.get(this.props.match, 'params.chatPartnerId');
    const userlist = this.props.userlist;
    const messages = this.props.chat.data;
    const chatParnerName = userlist[chatPartnerId].name;
    const networkErrorIndicator = this.state.disableChat ? 
    <LinearProgress style={{position: 'fixed', width: '96%'}} color="#337ab7" mode="indeterminate"/> : null;

    return (
      <div className='chat'>
        {networkErrorIndicator}
        <div className='chat-content'>
          <Conversation user={userId} userPhoto={this.props.userPhoto} users={userlist} messages={messages}/>
        </div>
        <div className='chat-chat-input'>
          <ChatInput onSend={this.sendMessage} disabled={false}/>
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
