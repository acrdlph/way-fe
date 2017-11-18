import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import ChatInput from '../components/chat-input';
import Conversation from '../components/conversation';
import {loadMessages, addMessagesToChat} from '../stores/chatStore';

class Chat extends React.Component {

  constructor(props) {
    super(props);

    const userId = sessionStorage.getItem('userId');
    const chatPartnerId = _.get(this.props.location, 'state.chatPartnerId');
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
    this.connection = new WebSocket(WEBSOCKET_BASE_URL+userId);
    const addMessages = this.props.addMessagesToChat;
    this.connection.onmessage = function (event) {
      console.log("receive websocket message: " + JSON.stringify(event.data));
      addMessages([JSON.parse(event.data)]);
    };
  }

  sendMessage(message) {
    const chatPartnerId = this.props.location.state.chatPartnerId;
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
    const usernames = this.props.usernames;
    const messages = this.props.chat.data;

    const connection = this.connection;
    return (
      <div>
        <NavLink to="/waitlist">
          <RaisedButton label="<<<"/>
        </NavLink>
        <Conversation user={userId} users={usernames} messages={messages}/>
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
  loadMessages: (userId, chatPartnerId) => dispatch(loadMessages(userId, chatPartnerId)),
  addMessagesToChat: (messages) => dispatch(addMessagesToChat(messages))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
