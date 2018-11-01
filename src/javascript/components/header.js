import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import { PAGES_WITH_HEADER } from '../util/constants';
import ChatHeader from './chat-header';
import { showOnboardingList } from '../stores/modalStore';
import GenericModal from './Modal';
import './header.less';

const createBackButton = to => (
  <NavLink to={to}>
    <span className="" />
  </NavLink>
);

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.openTheModal = this.openTheModal.bind(this);

    this.state = { shouldShowModal: false };
  }

  componentWillReceiveProps(props) {
    const { pathname } = this.props.location;

    if (this.props.location !== props.location) {
      this.forceUpdate();
    }
    const isInLoc = pathname.includes('qna');
    const isInList = pathname.includes('waitlist');
    const isInProfile = pathname.includes('profile');
    const { seenModals } = props;
    if (seenModals) {
      if (
        (isInProfile && !seenModals.seenProfModal)
        || (isInList && !seenModals.seenListModal)
        || (isInLoc && !seenModals.seenLocModal)
      ) {
        console.log(seenModals);
        this.setState({ shouldShowModal: true });
      } else {
        this.setState({ shouldShowModal: false });
      }
    }
  }

  openTheModal() {
    this.props.showListModal();
  }

  render() {
    const {
      username, photo, chatPartner, name, waitlist, seenModals,
    } = this.props;
    const { pathname } = this.props.location;
    const isHeaderVisible = _.filter(PAGES_WITH_HEADER, page => pathname.includes(page)).length > 0;
    const isInChat = pathname.includes('chat');
    const isInFeedback = pathname.includes('feedback');
    const isInLegalNotice = pathname.includes('legalnotice');
    const isInSignup = pathname.includes('register');
    const isInProfile = pathname.includes('profile');

    if (!isHeaderVisible) {
      return null;
    }

    if (isInChat) {
      return <ChatHeader chatPartner={chatPartner} />;
    }

    let backButton = null;
    console.log(seenModals, 'skata');
    // const shouldShowModal = (isInProfile && !seenModals.seenProfModal)
    //   || (isInLoc && !seenModals.seenLocModal)
    //   || (isInList && !seenModals.seenListModal);

    if (isInChat || isInProfile) {
      backButton = createBackButton('/waitlist');
    }
    if (isInFeedback || isInLegalNotice) {
      backButton = createBackButton('/');
    }
    const Modal = (this.props.showOnboardingList || this.state.shouldShowModal) && (
      <GenericModal pathname={pathname} />
    );

    const profileIcon = iconHide => (
      <div className={iconHide ? 'borderLine-hidden' : 'borderLine'}>
        <div className="header-profileicon">
          <Avatar
            className="header-profileicon-avatar"
            onClick={() => this.props.history.push('/profile')}
            src={photo}
          />
          <NavLink to="/profile" className="header-profileicon-username">
            {sessionStorage.getItem('username')}
          </NavLink>
        </div>
      </div>
    );

    const listOrQuestion = (
      <div className={isInSignup || isInFeedback ? 'listOrQuestion-hidden' : 'listOrQuestion'}>
        <NavLink to="/waitlist" onClick={() => sessionStorage.setItem('scrollPosition', 0)}>
          Geek List
        </NavLink>
        <NavLink to="/qna">Local Discussions</NavLink>
      </div>
    );

    const questionMarkIcon = (
      <div className="questionmark-icon">
        <button className="questionmark-button" onClick={this.openTheModal}>
          <img src="assets/24-icon-help.svg" />
        </button>
      </div>
    );

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
          {seenModals && !seenModals.seenProfModal && <div>Edit your profile here</div>}
          {seenModals && !seenModals.seenLocModal && <div>Share your thoughts here</div>}
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
  seenModals: _.get(state.user, 'data.seenModals'),
  name: _.get(state.user, 'data.name', ''),
  photo: _.get(state.user, 'data.photo', 'assets/32-icon-avatar.svg'),
  chatPartner: _.get(state.chatPartner, 'data'),
  showOnboardingList: state.modalStore.showOnboardingList,
  waitlist: state.waitlist,
});
const mapDispatchToProps = dispatch => ({
  showListModal: () => dispatch(showOnboardingList(true)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
