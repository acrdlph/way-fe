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
      <div className="chat-input container">
        <div className="chat-input-text">
          <TextField
            disabled={this.props.disabled}
            hintText="Message"
            fullWidth
            value={this.state.message}
            onChange={e => this.changeMessage(e)}
            onKeyPress={this.onKeyPressInTextField}
            multiLine
            rowsMax={3}
            autoFocus
          />
        </div>
        <div className="chat-input-button">
          <Button
            disabled={this.props.disabled}
            label="Send"
            backgroundColor="#43D676"
            onClick={this.sendMessage}
          />
        </div>
      </div>
    );
  }
}
