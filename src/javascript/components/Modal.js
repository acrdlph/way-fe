import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import { updateUserData } from '../stores/userStore';
import { showOnboardingList, showIncompleteModal } from '../stores/modalStore';
import onBoardingListStep1 from './onBoardingListStep1';
import onBoardingListStep2 from './onBoardingListStep2';
import onBoardingListStep3 from './onBoardingListStep3';
import onBoardingListStep4 from './onBoardingListStep4';
import onBoardingLocalStep1 from './onBoardingLocalStep1';
import onBoardingLocalStep2 from './onBoardingLocalStep2';
import onBoardingLocalStep3 from './onBoardingLocalStep3';
import onBoardingProfileStep1 from './onBoardingProfileStep1';
import onBoardingProfileStep2 from './onBoardingProfileStep2';
import onBoardingProfileStep3 from './onBoardingProfileStep3';
import onBoardingProfileStep4 from './onBoardingProfileStep4';
import './Modal.less';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
  },
  overlay: { zIndex: 10 },
};

class GenericModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: true,
      step: 1,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal(e) {
    e.preventDefault();
    const userId = sessionStorage.getItem('userId');
    const { pathname } = this.props;
    const seenModals = this.props.user.seenModals;
    let data;
    if (pathname) {
      if (pathname.includes('waitlist')) {
        data = {
          seenModals: {
            seenProfModal: seenModals.seenProfModal,
            seenLocModal: seenModals.seenLocModal,
            seenListModal: true,
          },
        };
      } else if (pathname.includes('qna')) {
        data = {
          seenModals: {
            seenProfModal: seenModals.seenProfModal,
            seenLocModal: true,
            seenListModal: seenModals.seenListModal,
          },
        };
      } else if (pathname.includes('profile')) {
        data = {
          seenModals: {
            seenProfModal: true,
            seenLocModal: seenModals.seenLocModal,
            seenListModal: seenModals.seenListModal,
          },
        };
      }
      this.props.updateUserData(userId, data);
    }
    this.props.close();
  }

  prevStep(e) {
    e.preventDefault();
    this.setState({ step: this.state.step - 1 });
  }

  nextStep(e) {
    e.preventDefault();
    this.setState({ step: this.state.step + 1 });
  }

  render() {
    let onBoardingSelectedContent;
    let triggeredBy;

    const { pathname } = this.props;

    const { step } = this.state;
    switch (true) {
      case /\b(waitlist).*/.test(pathname):
        triggeredBy = 'waitlist';
        switch (this.state.step) {
          case 1:
            onBoardingSelectedContent = onBoardingListStep1;
            break;
          case 2:
            onBoardingSelectedContent = onBoardingListStep2;
            break;
          case 3:
            onBoardingSelectedContent = onBoardingListStep3;
            break;
          case 4:
            onBoardingSelectedContent = onBoardingListStep4(this.closeModal);
            break;
        }
        break;
      case /\b(qna).*/.test(pathname):
        triggeredBy = 'local';
        switch (this.state.step) {
          case 1:
            onBoardingSelectedContent = onBoardingLocalStep1;
            break;
          case 2:
            // add these back and edit Steps once the local discaussions become local (once we add the distance filter to the feature)
            //   onBoardingSelectedContent = onBoardingLocalStep2;
            //   break;
            // case 3:
            onBoardingSelectedContent = onBoardingLocalStep3(this.closeModal);
            break;
        }
        break;
      case /\b(profile).*/.test(pathname):
        triggeredBy = 'profile';
        switch (this.state.step) {
          case 1:
            onBoardingSelectedContent = onBoardingProfileStep1;
            break;
          case 2:
            onBoardingSelectedContent = onBoardingProfileStep2;
            break;
          case 3:
            onBoardingSelectedContent = onBoardingProfileStep3;
            break;
          case 4:
            onBoardingSelectedContent = onBoardingProfileStep4(this.closeModal);
            break;
        }
        break;
    }
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          {this.props.content || onBoardingSelectedContent}
          {triggeredBy ? (
            <form>
              {!(
                (triggeredBy === 'waitlist'
                  || triggeredBy === 'local'
                  || triggeredBy === 'profile')
                && step === 1
              ) && (
                <button onClick={e => this.prevStep(e)} className="arrowPreview">
                  <img src="assets/40-icon-back.svg " alt="arrow to next" />
                </button>
              )}
              <button onClick={this.closeModal} className="buttonRemove">
                <img src="assets/10-icon-remove.svg " alt="arrow to next" />
              </button>
              {!(
                ((triggeredBy === 'waitlist' || triggeredBy === 'profile') && step === 4)
                || (triggeredBy === 'local' && step === 2)
              ) && (
                <button onClick={e => this.nextStep(e)} className="arrowNext">
                  <img src="assets/40-icon-back.svg" alt="arrow to back" />
                </button>
              )}
            </form>
          ) : (
            <button onClick={e => this.closeModal(e)} className="buttonRemove">
              <img src="assets/10-icon-remove.svg " alt="arrow to next" />
            </button>
          )}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user.data,
});
const mapDispatchToProps = dispatch => ({
  close: () => {
    dispatch(showOnboardingList(false));
    dispatch(showIncompleteModal(false));
  },
  updateUserData: (userId, data) => dispatch(updateUserData(userId, data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GenericModal);
