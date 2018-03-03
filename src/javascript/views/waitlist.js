import React from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {List} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import _ from 'lodash';
import fetch from 'isomorphic-fetch';
import {trackPageView} from '../util/google-analytics';
import UserData from '../components/user-data';
import WaitListItem from '../components/waitlist-item';
import Infobox from '../components/infobox';
import EmptyLocationMessage from '../components/empty-location-message';
import {loadWaitlist} from '../stores/waitlistStore';
import {transformMessages, notifyNewMessage} from '../stores/chatStore';
import {loadUserData, isOnboarded} from '../stores/userStore';
import {initWebSocketStore} from '../stores/webSocketStore';
import {loadPartnerData} from '../stores/partnerStore';
import {requestPermissionForNotifications} from '../util/notification';
import {PARTNER_LOCATIONS} from '../util/constants';
import './waitlist.less';

class WaitList extends React.Component {

  constructor(props) {
    super(props);

    const path = this.props.location.pathname;
    trackPageView(path);

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

  componentDidMount() {
    // initialize so that messages can be delivered, but not acted upon
    // TODO handle the incoming messages and update chat bubbles
    initWebSocketStore(sessionStorage.getItem('userId'),
      (event) => notifyNewMessage(transformMessages([event])[0]));
  }

  openChat(chatPartnerId) {
    console.log('open chat with: ' + chatPartnerId);
    const locationId = sessionStorage.getItem('locationId');
    this.props.history.push({
      pathname: `/waitlist/${locationId}/chat/${chatPartnerId}`
    });
  }



  /* partner locations deactivated for now
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
    if(_.includes(PARTNER_LOCATIONS, airportCode)) {
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
  */

  render() {
    const list = [];

    /*
    const waitlistItemOfAirport = this.createAirportCard();
    if(waitlistItemOfAirport) {
      list.push(waitlistItemOfAirport);
    }
    */

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

    const isLoggedInUser = !!this.props.user.data.username;
    list.push(
      <EmptyLocationMessage showChallenge={FEATURE_WAITCOIN_CHALLENGE && isLoggedInUser}/>
    );

    return (
      <div>
        <UserData/>
        <Infobox
          visible={!isUserOnboarded && this.state.showIncompleteProfileHint}
          text={'Enter your name and interests to start communicating with other passengers'}
        />
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
