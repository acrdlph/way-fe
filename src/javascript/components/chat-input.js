import React from 'react';
import { Button, TextField } from '@material-ui/core';
import './chat-input.less';

export default class ChatInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
    this.changeMessage = this.changeMessage.bind(this);
    this.onKeyPressInTextField = this.onKeyPressInTextField.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  onKeyPressInTextField(event) {
    if (event.key === 'Enter') {
      this.sendMessage();
      event.preventDefault();
    }
  }

  changeMessage(e) {
    this.setState({ message: e.target.value });
  }

  sendMessage() {
    if (this.state.message.trim().length > 0) {
      this.props.onSend(this.state.message);
      this.setState({ message: '' });
    }
  }

  render() {
    return (
      <div className="chat-input">
        <div className="chat-input-text">
          <TextField
            disabled={this.props.disabled}
            fullWidth
            value={this.state.message}
            onChange={e => this.changeMessage(e)}
            onKeyPress={this.onKeyPressInTextField}
            rowsMax={3}
            autoFocus
            InputProps={{ disableUnderline: true }}
            multiline={true}
          />
        </div>
        <div className="chat-input-button">
          <button className="chatButton" disabled={this.props.disabled} onClick={this.sendMessage}>
            Send
          </button>
        </div>
      </div>
    );
  }
}
