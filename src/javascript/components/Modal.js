import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import RaisedButton from 'material-ui/RaisedButton';
import { showTheModal } from '../stores/modalStore';
import { connect } from 'react-redux';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

export class GenericModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: true,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  
  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.props.close();
 }

  render() {
    
    return (
      <div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
         {this.props.content}
          <form>
          <button onClick={this.closeModal}>Continue</button>
          </form>
        </Modal>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  close: () => {
    dispatch(showTheModal(false));
  }
});

export default connect(null, mapDispatchToProps)(GenericModal);