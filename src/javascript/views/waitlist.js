import React from 'react';
import Slider from 'material-ui/Slider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import _ from 'lodash';
import Profile from '../components/profile';

export default class WaitList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      onTheList: [
        {
          name: "Brendan Lim",
          interests: "I am just waiting here...",
          timeLeft: 50
        },
        {
          name: "Eric Hoffman",
          interests: "Anyone wants to drink a coffee with me?",
          timeLeft: 80
        }
      ]
    };
  }

  render() {
    const onTheList = this.state.onTheList;
    const list = [];
    _.each(onTheList, entry => {
      list.push(
        <ListItem
          primaryText={entry.interests}
          rightIcon={<CommunicationChatBubble />}
        />
      );
    });

    return (
      <div style={{width: '400px'}}>
        <Profile/>
        <List>
          {list}
        </List>
      </div>
    );
  }
}
