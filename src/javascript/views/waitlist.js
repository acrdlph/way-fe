import React from 'react';
import Slider from 'material-ui/Slider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import TextField from 'material-ui/TextField';

export default class WaitList extends React.Component {
  render() {
    return (
      <div style={{width: '400px'}}>

      <TextField hintText="Interests"/>
      <TextField hintText="Name"/>

      <List>
            <ListItem
              primaryText="Brendan Lim"
              leftAvatar={<Avatar src="images/ok-128.jpg" />}
              rightIcon={<CommunicationChatBubble />}
            />
            <ListItem
              primaryText="Eric Hoffman"
              leftAvatar={<Avatar src="images/kolage-128.jpg" />}
              rightIcon={<CommunicationChatBubble />}
            />
            <ListItem
              primaryText="Grace Ng"
              leftAvatar={<Avatar src="images/uxceo-128.jpg" />}
              rightIcon={<CommunicationChatBubble />}
            />
        </List>

      </div>
    );
  }
}
