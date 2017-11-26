import React from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {List} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import Profile from '../components/profile';
import WaitListItem from '../components/waitlist-item';
import Infobox from '../components/infobox';
import {loadWaitlist} from '../stores/waitlistStore';
import {loadUserData, isOnboarded} from '../stores/userStore';
import {loadPartnerData} from '../stores/partnerStore';
import {requestPermissionForNotifications} from '../util/notification';
import {supportedLocations} from '../util/constants';
import './waitlist.less';

class WaitList extends React.Component {

  constructor(props) {
    super(props);

    const userId = sessionStorage.getItem('userId');
    const locationIdFromPath = _.get(this.props.match, 'params.locationId');
    if(userId) {

      // redirect to waitlist where the user is signed in
      const locationId = sessionStorage.getItem('locationId');
      if(!locationIdFromPath || locationIdFromPath != locationId) {
        console.log(`redirect to /waitlist/${locationId}`);
        this.props.history.push(`/waitlist/${locationId}`);
      }

      this.props.loadUserData(userId);
      this.props.loadWaitlist(userId);
      if(!this.props.partners.loaded) {
        this.props.loadPartnerData();
      }
    } else {
      if(locationIdFromPath) {
        this.props.history.push(`/signup/${locationIdFromPath}`);
      } else {
        this.props.history.push('/signup');
      }
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

  createAirportCard() {
    const airportCode = _.get(this.props.user, 'data.location');
    if(!airportCode) {
      return null;
    }

    const {data: partners} = this.props.partners;
    const airportNames = _.filter(partners, p => {
      return p.uniqueKey.toLowerCase() === airportCode.toLowerCase();
    });
    let airportName = null;
    if(airportNames.length === 1) {
      airportName = airportNames[0].name;
    }

    airportName = airportName || airportCode;
    if(_.includes(supportedLocations, airportCode)) {
      const logoPath = `assets/airport-logo-${airportCode}-small.jpg`;
      return (
        <WaitListItem
          key={'partnerCard'}
          interests={`Welcome to ${airportName}!`}
          photo={logoPath}
          name={airportName}
        />
      );
    }
    return null;
  }

  render() {
    const list = [];
    const waitlistItemOfAirport = this.createAirportCard();
    list.push(waitlistItemOfAirport);

    const {isUserOnboarded} = this.props;
    _.each(this.props.waitlist.data, (entry, key) => {
      const onClick = isUserOnboarded
        ? () => this.openChat(entry.id)
        : () => this.setState({showIncompleteProfileHint: true});
      list.push(
        <WaitListItem
          key={key}
          interests={entry.interests}
          photo={entry.photo}
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
        <div className='divider'/>
        <List>
          {list}
        </List>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  waitlist: state.waitlist,
  user: state.user,
  isUserOnboarded: isOnboarded(state.user),
  partners: state.partners
});

const mapDispatchToProps = dispatch => ({
  loadWaitlist: (userId) => dispatch(loadWaitlist(userId)),
  loadUserData: (userId) => dispatch(loadUserData(userId)),
  loadPartnerData: () => dispatch(loadPartnerData())
});

export default connect(mapStateToProps, mapDispatchToProps)(WaitList);
