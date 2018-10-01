import React from 'react';
import { connect } from 'react-redux';
import Slider from 'material-ui/Slider';
import { List } from 'material-ui/List';
import _ from 'lodash';
import { trackPageView } from '../util/google-analytics';
import WaitListItem from '../components/waitlist-item';
import { loadWaitlist } from '../stores/waitlistStore';
import { notifyNewMessage } from '../stores/chatStore';
import { loadUserData, isOnboarded } from '../stores/userStore';
import { initWebSocketStore } from '../stores/webSocketStore';
import { loadChatPartnerData } from '../stores/chatPartnerStore';
import { requestPermissionForNotifications } from '../util/notification';
import './waitlist.less';
import Web3Component, { initContract, getWeb3 } from '../components/Web3Component';
import Blockgeeks from '../../abi/Blockgeeks.json';
import { showIncompleteModal } from '../stores/modalStore';
import GenericModal from '../components/Modal';
import incompleteProfileModal from '../components/incompleteProfileModalContent';

class WaitList extends React.Component {
  constructor(props) {
    super(props);

    const path = this.props.location.pathname;
    trackPageView(path);

    const userId = sessionStorage.getItem('userId');
    const locationIdFromPath = _.get(this.props.match, 'params.locationId');

    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.changeDistance = this.changeDistance.bind(this);
    this.changeReputation = this.changeReputation.bind(this);

    if (userId) {
      // redirect to waitlist where the user is signed in
      const locationId = sessionStorage.getItem('locationId');
      if (!locationIdFromPath || locationIdFromPath != locationId) {
        this.props.history.push(`/waitlist/${locationId}`);
      }

      this.props.loadUserData(userId);
      this.props.loadWaitlist(userId, this.props.waitlist.viewQuestions);
    } else if (locationIdFromPath) {
      this.props.history.push(`/signup/${locationIdFromPath}`);
    } else {
      this.props.history.push('/signup');
    }

    this.state = {
      showIncompleteProfileHint: false,
      contractAddress: '0xbaa593e9c1f11bbcfa4725085211d764eec26592',
      showNotification: false,
    };
    this.openChat = this.openChat.bind(this);

    if (FEATURE_NOTIFICATIONS) {
      requestPermissionForNotifications();
    }

    this.setState({
      distance: 5000,
      reputation: 100,
      contract: null,
    });
  }

  componentDidMount() {
    // initialize so that messages can be delivered, but not acted upon
    // TODO handle the incoming messages and update chat bubbles

    document.title = 'People | CryptoGeeks';

    const contract = initContract(Blockgeeks);
    this.setState({ contract });
  }

  openChat(chatPartnerId) {
    const locationId = sessionStorage.getItem('locationId');
    this.props.history.push({
      pathname: `/waitlist/${locationId}/chat/${chatPartnerId}`,
    });
  }

  handleOpenModal() {
    this.props.showModal();
  }

  changeDistance(event, value) {
    // @TODO: store distance in backend
    const roundedValue = Math.floor(value);
    sessionStorage.setItem('distance', roundedValue);
    const userId = sessionStorage.getItem('userId');
    this.props.loadWaitlist(userId, this.props.waitlist.showQuestions);
    this.setState({
      distance: roundedValue,
    });
  }

  changeReputation(event, value) {
    // @TODO: store reputation in backend
    const roundedValue = Math.floor(value);
    this.setState({
      reputation: roundedValue,
    });
  }

  render() {
    const list = [];
    const { isUserOnboarded, chat } = this.props;
    const { distance, reputation, showNotification } = this.state;
    const Modal = this.props.showIncompleteModal && (
      <GenericModal content={incompleteProfileModal} />
    );

    _.each(this.props.waitlist.data, (entry, key) => {
      const onClick = isUserOnboarded
        ? () => this.openChat(entry.id)
        : () => this.handleOpenModal();

      const onEndorse = this.state.contract && this.state.contract.endorse;
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
          onEndorse={onEndorse}
          address={entry.address}
          endorsement={entry.endorsement}
          balance={entry.balance}
        />,
      );
    });

    initWebSocketStore(sessionStorage.getItem('userId'), (event) => {
      this.props.loadChatParnerData(event.sender_id);
      setTimeout(() => {
        const partner = this.props.chatPartner.data.name;
        notifyNewMessage(event, partner);
      });
    });

    //    list.push(
    //      <EmptyLocationMessage showChallenge={FEATURE_WAITCOIN_CHALLENGE && isLoggedInUser}/>
    //    );

    return (
      <div className="waitListBody">
        <div>
          {Modal}
          <div>
            <ul className="signup-wait-dist signup-wait ">
              <li className="signup-wait-for-li">
                <strong className="signup-wait-for">Distance</strong>
              </li>
              <li>
                <div className="signup-slider-distance">
                  <Slider
                    min={100}
                    max={10000}
                    step={10}
                    defaultValue={5000}
                    onChange={this.changeDistance}
                  />
                </div>
              </li>
              <li className="title">
                <p className="signup-wait-for">{`${distance || 5000} meters`}</p>
              </li>
            </ul>
          </div>

          <List>{list}</List>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  waitlist: state.waitlist,
  user: state.user,
  isUserOnboarded: isOnboarded(state.user),
  chat: state.chat,
  chatPartner: state.chatPartner,
  showIncompleteModal: state.modalStore.showIncompleteModal,
});

const mapDispatchToProps = dispatch => ({
  loadWaitlist: userId => dispatch(loadWaitlist(userId)),
  showModal: () => dispatch(showIncompleteModal(true)),
  loadUserData: userId => dispatch(loadUserData(userId)),
  loadChatParnerData: chatPartnerId => dispatch(loadChatPartnerData(chatPartnerId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WaitList);
