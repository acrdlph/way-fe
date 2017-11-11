import React from 'react';
import {Button} from 'react-bootstrap';
import TextField from 'material-ui/TextField';

export default class ChatInput extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: '',
    };
    this.changeMessage = this.changeMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
  }

  changeMessage(event, message) {
    this.setState({message});
  }

  sendMessage() {
    this.props.onSend(this.state.message);
    this.setState({message: ''});
  }

  render() {
    return (
      <div>
        <TextField hintText="Message" value={this.state.message} onChange={this.changeMessage}/>
        <Button onClick={this.sendMessage}>Send</Button>
      </div>
    );
  }
}
