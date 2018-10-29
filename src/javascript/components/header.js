import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
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
    const isInSignup = this.props.location.pathname.includes('register');

    const Modal = this.props.showOnBoardingModal && <GenericModal content={onBoardingContent} />;

    const profileIcon = iconHide => (
      <div className={iconHide ? 'borderLine-hidden' : 'borderLine'}>
        <div className="header-profileicon">
          <NavLink
            to="/profile"
            className=""
            onClick={this.handleNavClick}
          ><Avatar className="header-profileicon-avatar" src={photo} /></NavLink>
          <NavLink
            to="/profile"
            activeStyle={{ borderBottom: 'solid 3px #0095b3' }}
            className="header-profileicon-username"
            onClick={this.handleNavClick}
          >{username || name}</NavLink>
        </div>
      </div>
    );

    const listOrQuestion = (
      <div className={isInSignup || isInFeedback ? 'listOrQuestion-hidden' : 'listOrQuestion'}>
        <NavLink
          to="/waitlist"
          onClick={() => sessionStorage.setItem('scrollPosition', 0)}
          activeStyle={{ borderBottom: 'solid 3px #0095b3', paddingBottom: '1em' }}
        >
          Geek List
        </NavLink>
        <NavLink
          to="/qna"
          activeStyle={{ borderBottom: 'solid 3px #0095b3', paddingBottom: '1em' }}
          onClick={this.handleNavClick}
        >
          Local Discussions
        </NavLink>
      </div>
    );

    const questionMarkIcon = (
      <div className="questionmark-icon">
        <button className="questionmark-button" onClick={this.openTheModal}>
          <img src="assets/24-icon-help.svg" />
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
            <NavLink
              to="/waitlist"
              onClick={() => sessionStorage.setItem('scrollPosition', 'toTop')}
            >
              <img src="assets/cg-logo.svg" />
            </NavLink>
          </div>
        </div>
        <div className="listQuestion">{listOrQuestion}</div>
        <div className="markProfile">
          {pathname === '/register' || pathname === '/feedback'
            ? profileIcon(true)
            : profileIcon(false)}

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
  photo: _.get(state.user, 'data.photo', 'assets/32-icon-avatar.svg'),
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
