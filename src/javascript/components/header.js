import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import MaterialUiAvatar from 'material-ui/Avatar';
import { PAGES_WITH_HEADER } from '../util/constants';
import { extractLocationName } from './location-header';
import ChatHeader from './chat-header';
import { showOnBoardingModal, showIncompleteModal } from '../stores/modalStore';
import GenericModal from './Modal';
import onBoardingContent from './onBoardingModalContent';
import './header.less';

const createBackButton = to => (
  <NavLink to={to}>
    <span className="glyphicon glyphicon glyphicon-chevron-left" />
  </NavLink>
);

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.openTheModal = this.openTheModal.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);
  }

  openTheModal() {
    this.props.showModal();
  }

  handleNavClick() {
    this.props.showIncModal();
  }

  render() {
    const {
      username, photo, locationName, chatPartner, name, waitlist,
    } = this.props;
    const { pathname } = this.props.location;
    const isHeaderVisible = _.filter(PAGES_WITH_HEADER, page => pathname.includes(page)).length > 0;
    const isInChat = pathname.includes('chat');
    if (!isHeaderVisible) {
      return null;
    }

    if (isInChat) {
      return <ChatHeader chatPartner={chatPartner} />;
    }

    let backButton = null;

    const isInProfile = pathname.includes('profile');
    if (isInChat || isInProfile) {
      backButton = createBackButton('/waitlist');
    }
    const isInFeedback = this.props.location.pathname.includes('feedback');
    const isInLegalNotice = this.props.location.pathname.includes('legalnotice');
    if (isInFeedback || isInLegalNotice) {
      backButton = createBackButton('/');
    }

    const Modal = this.props.showOnBoardingModal && <GenericModal content={onBoardingContent} />;

    const profileIcon = iconHide => (
      <div className={iconHide ? 'header-profileicon-hidden' : 'header-profileicon'}>
        <NavLink to="/profile" onClick={this.handleNavClick}>
          <MaterialUiAvatar size={35} src={photo} />
          <span className="header-profileicon-username">{username || name}</span>
        </NavLink>
      </div>
    );

    const listOrQuestion = (
      <div className="listOrQuestion">
        <NavLink to="/waitlist">Geek List</NavLink>
        <NavLink to="/qna" onClick={this.handleNavClick}>
          Local Discussions
        </NavLink>
      </div>
    );

    const questionMarkIcon = (
      <div className="questionmark-icon">
        <button className="questionmark-button" onClick={this.openTheModal}>
          <img src="assets/questionMark.svg" />
        </button>
      </div>
    );

    const location = locationName ? (
      <div className="header-location">
        <NavLink to="/signup">{locationName}</NavLink>
        <img src="assets/waitlist-location-icon.png" />
      </div>
    ) : null;

    return (
      <div className="header">
        <div className="logo">
          <div className="header-back-button">{backButton}</div>
          <div className="header-logo">
            <NavLink to="/waitlist">
              <img src="assets/bglogo.png" />
            </NavLink>
          </div>
        </div>
        <div className="listQuestion">{listOrQuestion}</div>
        <div className="markProfile">
          <div className="borderLine">
            {pathname === '/register' ? profileIcon(true) : profileIcon(false)}
          </div>
          <div>
            {Modal}
            {questionMarkIcon}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  username: _.get(state.user, 'data.username'),
  name: _.get(state.user, 'data.name', ''),
  photo: _.get(state.user, 'data.photo', 'assets/avatar-placeholder.png'),
  locationName: extractLocationName(state),
  chatPartner: _.get(state.chatPartner, 'data'),
  showOnBoardingModal: state.modalStore.showOnBoardingModal,
  waitlist: state.waitlist,
});
const mapDispatchToProps = dispatch => ({
  showModal: () => dispatch(showOnBoardingModal(true)),
  showIncModal: () => dispatch(showIncompleteModal(false)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
