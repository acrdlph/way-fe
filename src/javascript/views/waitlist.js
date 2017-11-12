import React from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {List} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import Profile from '../components/profile';
import WaitListItem from '../components/waitlist-item';

class WaitList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      onTheList: []
    };
    const userId = sessionStorage.getItem('userId');
    const endpoint = 'api/users/' + userId;
    fetch(endpoint)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const onTheList = [];
      _.each(data, entry => {
        onTheList.push({
          id: entry.id,
          name: entry.name || '',
          interests: entry.interests || '',
          timeLeft: entry.time_left,
          hasChat: false
        });
      });
      const onTheListSorted = _.reverse(_.sortBy(onTheList, 'timeLeft'));
      this.setState({
        onTheList: onTheListSorted
      });
    });

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
          name={entry.name}
          timeLeft={entry.timeLeft}
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

const mapStateToProps = (state) => ({
  waitlist: state.waitlist
});

export default connect(mapStateToProps)(WaitList);
