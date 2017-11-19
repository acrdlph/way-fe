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
import Infobox from '../components/infobox';
import {loadWaitlist} from '../stores/waitlistStore';
import {loadUserData, isOnboarded} from '../stores/userStore';
import {requestPermissionForNotifications} from '../util/notification';
import './waitlist.less';

class WaitList extends React.Component {

  constructor(props) {
    super(props);

    const userId = sessionStorage.getItem('userId');
    if(userId) {

      // redirect to waitlist where the user is signed in
      const locationId = sessionStorage.getItem('locationId');
      const locationIdFromPath = _.get(this.props.match, 'params.locationId');
      if(!locationIdFromPath || locationIdFromPath != locationId) {
        console.log(`redirect to /waitlist/${locationId}`);
        this.props.history.push(`/waitlist/${locationId}`);
      }

      this.props.loadUserData(userId);
      this.props.loadWaitlist(userId);
    } else {
      this.props.history.push("/signup");
    }

    this.state = {
      showIncompleteProfileHint: false
    };
    this.openChat = this.openChat.bind(this);

    if(FEATURE_NOTIFICATIONS) {
      requestPermissionForNotifications();
    }
  }

  openChat(chatPartnerId) {
    console.log('open chat with: ' + chatPartnerId);
    const locationId = sessionStorage.getItem('locationId');
    this.props.history.push({
      pathname: `/waitlist/${locationId}/chat/${chatPartnerId}`
    });
  }

  render() {
    const list = [];
    const {isUserOnboarded} = this.props;
    _.each(this.props.waitlist.data, (entry, key) => {
      const onClick = isUserOnboarded
        ? () => this.openChat(entry.id)
        : () => this.setState({showIncompleteProfileHint: true});
      list.push(
        <WaitListItem
          key={key}
          interests={entry.interests}
          name={entry.name}
          timeLeft={entry.timeLeft}
          hasChat={entry.hasChat}
          nonDeliveredChatCount={entry.nonDeliveredChatCount}
          lastContact={entry.lastContact}
          onClick={onClick}
        />
      );
    });

    return (
      <div>
        <Profile/>
        <Infobox
          visible={!isUserOnboarded && this.state.showIncompleteProfileHint}
          text={'Enter your name and interests to start communicating with other passengers'}
        />
        <div className='waitlist-profile-divider'/>
        <List>
          {list}
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  waitlist: state.waitlist,
  isUserOnboarded: isOnboarded(state.user)
});

const mapDispatchToProps = dispatch => ({
  loadWaitlist: (userId) => dispatch(loadWaitlist(userId)),
  loadUserData: (userId) => dispatch(loadUserData(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(WaitList);
