import React from 'react';
import Modal from 'react-modal';
import { connect } from 'react-redux';
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

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
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

  closeModal() {
    this.props.close();
  }

  prevStep() {
    this.setState({ step: this.state.step - 1 });
  }

  nextStep() {
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
            onBoardingSelectedContent = onBoardingListStep4;
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
            onBoardingSelectedContent = onBoardingLocalStep2;
            break;
          case 3:
            onBoardingSelectedContent = onBoardingLocalStep3;
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
            onBoardingSelectedContent = onBoardingProfileStep4;
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
          <form>
            {!(
              (triggeredBy === 'waitlist'
                || triggeredBy === 'local'
                || triggeredBy === 'profile')
              && step === 1
            ) && <button onClick={this.prevStep}>previous</button>}
            {!(
              ((triggeredBy === 'waitlist' || triggeredBy === 'profile') && step === 4)
              || (triggeredBy === 'local' && step === 3)
            ) && <button onClick={this.nextStep}>next</button>}
            <button onClick={this.closeModal}>Continue</button>
          </form>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  close: () => {
    dispatch(showOnboardingList(false));
    dispatch(showIncompleteModal(false));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(GenericModal);
