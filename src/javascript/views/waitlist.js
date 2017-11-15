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
import {loadWaitlist} from '../stores/waitlistStore';
import {loadUserData} from '../stores/userStore';

class WaitList extends React.Component {

  constructor(props) {
    super(props);

    const userId = sessionStorage.getItem('userId');
    if(userId) {
      this.props.loadUserData(userId);
      this.props.loadWaitlist(userId);
    } else {
      this.props.history.push("/signup");
    }

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
    const list = [];
    _.each(this.props.waitlist.data, (entry, key) => {
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

const mapDispatchToProps = dispatch => ({
  loadWaitlist: (userId) => dispatch(loadWaitlist(userId)),
  loadUserData: (userId) => dispatch(loadUserData(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(WaitList);
