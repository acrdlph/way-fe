import React from 'react';
import Slider from 'material-ui/Slider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {List} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import _ from 'lodash';
import Profile from '../components/profile';
import WaitListItem from '../components/waitlist-item';

export default class WaitList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      onTheList: [
        {
          id: 1,
          name: "Brendan Lim",
          interests: "I am just waiting here...",
          timeLeft: 50,
          hasChat: true
        },
        {
          id: 2,
          name: "Eric Hoffman",
          interests: "Anyone wants to drink a coffee with me?",
          timeLeft: 80,
          hasChat: false
        }
      ]
    };
    this.openChat = this.openChat.bind(this);
  }

  openChat(chatPartnerId) {
    console.log('open chat with: ' + chatPartnerId);
    this.props.history.push({
      pathname: '/chat',
      state: {chatPartnerId}
    });
  }

  render() {
    const onTheList = this.state.onTheList;
    const list = [];
    _.each(onTheList, (entry, key) => {
      list.push(
        <WaitListItem
          key={key}
          interests={entry.interests}
          hasChat={entry.hasChat}
          onClick={() => this.openChat(entry.id)}
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
