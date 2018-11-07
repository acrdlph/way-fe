import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import LinearProgress from 'material-ui/LinearProgress';
import { trackPageView, trackEvent, events } from '../util/google-analytics';
import ChatInput from '../components/chat-input';
import Conversation from '../components/conversation';
import {
  loadMessages,
  addMessagesToChat,
  notifyNewMessage,
  notificationSent,
} from '../stores/chatStore';
import { loadUserData } from '../stores/userStore';
import { loadChatPartnerData } from '../stores/chatPartnerStore';
import { initWebSocketStore, send, markDelivered } from '../stores/webSocketStore';
import './chat.less';

class Chat extends React.Component {
  constructor(props) {
    super(props);

    const path = this.props.location.pathname;
    const chatPathWithoutPartnerId = path.substring(0, path.indexOf('/chat') + 5);
    trackPageView(chatPathWithoutPartnerId);

    this.sendMessage = this.sendMessage.bind(this);
    this.onMessageUpdate = this.onMessageUpdate.bind(this);
    this.updateContacts = this.updateContacts.bind(this);
    this.goToChat = this.goToChat.bind(this);
    this.enableChat = this.enableChat.bind(this);
    this.disableChat = this.disableChat.bind(this);
    this.state = {
      disableChat: false,
      partners: this.props.chatPartner.data,
    };
  }

  componentDidMount() {
    const userId = sessionStorage.getItem('userId');
    initWebSocketStore(
      userId,
      /* new message */ this.onMessageUpdate,
      () => {
        // connected
        this.enableChat();
      },
      () => {
        // connection closed
        this.disableChat();
      },
    );
    const chatPartnerId = _.get(this.props.match, 'params.chatPartnerId');
    this.props.loadChatParnerData();
    this.props.loadUserData(userId);
    if (userId && chatPartnerId) {
      this.props.loadMessages(userId, chatPartnerId);
    }
  }

  componentWillReceiveProps(props) {
    if (props.chatPartner.data !== this.props.chatPartner.data) {
      this.setState({ partners: props.chatPartner.data });
      console.log(this.props.location.pathname);
      this.props.location.pathname === '/chat'
        && this.goToChat(sessionStorage.getItem('userId'), props.chatPartner.data[0].id);
    }
    this.setState({ messages: props.chat.data });
  }

  onMessageUpdate(message) {
    const chatPartnerId = _.get(this.props.match, 'params.chatPartnerId');
    const userId = sessionStorage.getItem('userId');
    this.props.addMessagesToChat([message], chatPartnerId);
    if (message.sender_id !== userId) {
      markDelivered(message);
      trackEvent(events.USER_RECEIVED_MESSAGE);
      notifyNewMessage(message, 'Someone');
    }
    // const partner = this.props.chatPartner.data.name;
    // notifyNewMessage(event, partner);
    this.props.notificationSent();
    this.updateContacts();
  }

  updateContacts() {
    const chatPartnerId = _.get(this.props.match, 'params.chatPartnerId');
    let partners = this.state.partners.slice();
    if (partners.filter(partn => partn.id === chatPartnerId).length > 0) {
      const partnerIndex = partners.findIndex(partn => partn.id === chatPartnerId);
      const currentPartner = partners.slice(partnerIndex, partnerIndex + 1);
      partners.splice(partnerIndex, 1);
      currentPartner.push(...partners);
      partners = currentPartner;
      this.setState({ partners });
    } else {
      this.props.loadChatParnerData();
    }
  }

  goToChat(userId, chatPartnerId) {
    this.props.history.push({
      pathname: `/chat/${chatPartnerId}`,
    });
    this.props.loadMessages(userId, chatPartnerId);
  }

  enableChat() {
    this.setState({
      disableChat: false,
    });
  }

  disableChat() {
    this.setState({
      disableChat: true,
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
      receiver_id: chatPartnerId,
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
    const { pathname } = this.props.location;
    const isInSignup = pathname.includes('register');
    const user = _.get(this.props.user, 'data');
    const partner = _.get(this.props.chatPartner, 'data');
    const userDetails = {
      id: userId,
      name: user.name,
      photo: user.photo,
    };
    const partnerDetails = {
      id: chatPartnerId,
      name: partner.name,
      photo: partner.photo,
    };
    const messages = this.state.messages && this.state.messages;
    const networkErrorIndicator = this.state.disableChat ? (
      <LinearProgress
        style={{ position: 'fixed', width: '96%' }}
        color="#337ab7"
        mode="indeterminate"
      />
    ) : null;

    return (
      <div className="chatContainer">
        {networkErrorIndicator}
        <div className="usersBox">
          {this.state.partners.map(partner => (
            <div
              className={pathname.includes(`${partner.id}`) ? 'chatActive' : 'contactBox'}
              onClick={() => this.goToChat(userId, partner.id)}
            >
              <img src={partner.photo || 'assets/32-icon-avatar.svg'} />
              <p>{partner.name}</p>
            </div>
          ))}
        </div>
        <div className="chatBox">
          <div className="infoUserBox">
            {' '}
            {/* Disabled */}
            <div className="infoTextBox">
              <h6>Christopher Sandoval</h6>
              <p>active 46min ago</p>
            </div>
            <div className="infoImgBox">
              <img src="assets/40-icon-more.svg" />
            </div>
          </div>
          <Conversation
            className="conversationBox"
            user={userDetails}
            partner={partnerDetails}
            messages={messages}
          />
          <div className="chatInput">
            <ChatInput onSend={this.sendMessage} disabled={false} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  chat: state.chat,
  user: state.user,
  chatPartner: state.chatPartner,
});

const mapDispatchToProps = dispatch => ({
  loadMessages: (userId, chatPartnerId) => dispatch(loadMessages(userId, chatPartnerId)),
  addMessagesToChat: (messages, chatPartnerId) => dispatch(addMessagesToChat(messages, chatPartnerId)),
  notificationSent: () => dispatch(notificationSent()),
  loadUserData: userId => dispatch(loadUserData(userId)),
  loadChatParnerData: chatPartnerId => dispatch(loadChatPartnerData(chatPartnerId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Chat);
