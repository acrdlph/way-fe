import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import ChatItem from '../components/chat-item';
import ChatInput from '../components/chat-input';
import {loadMessages, addMessagesToChat} from '../stores/chatStore';

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
    const messages = this.props.chat.data;
    const usernames = this.props.usernames;
    _.each(messages, message => {
      const isLeft = message.sender == userId;
      chatItems.push(
        <ChatItem key={message.id} name={usernames[message.sender]} text={message.message} left={isLeft}/>
      );
    });

    const connection = this.connection;
    return (
      <div style={{width: '400px'}}>
        <NavLink to="/waitlist">
          <RaisedButton label="<<<"/>
        </NavLink>
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
  loadMessages: (userId, chatPartnerId) => dispatch(loadMessages(userId, chatPartnerId)),
  addMessagesToChat: (messages) => dispatch(addMessagesToChat(messages))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
