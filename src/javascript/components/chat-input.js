import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
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

  changeMessage(event, message) {
    this.setState({message});
  }

  onKeyPressInTextField(event) {
    if (event.key === 'Enter') {
      this.sendMessage();
      event.preventDefault();
    }
  }

  sendMessage() {
    this.props.onSend(this.state.message);
    this.setState({message: ''});
  }

  render() {
    return (
      <div className='chat-input'>
        <div className='chat-input-text'>
          <TextField
            hintText="Message"
            value={this.state.message}
            onChange={this.changeMessage}
            onKeyPress={this.onKeyPressInTextField}
          />
        </div>

          <RaisedButton className='chat-input-button' label="Send" onClick={this.sendMessage}/>

      </div>
    );
  }
}
