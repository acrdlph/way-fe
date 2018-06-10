import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import RaisedButton from 'material-ui/RaisedButton';


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

export class OnBoarding extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  
  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
    this.props.saveAndContinue();
  }

  render() {
    return (
      <div>
        
        <RaisedButton
          label="Start"
          className="start"
          backgroundColor='#43d676'
          onClick={this.openModal}
        />
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <h2 ref={subtitle => this.subtitle = subtitle}>Hello</h2>
          <div>
            1. About us <br>
            </br>
            CG is the first token-curated ranking of  trusted blockchain experts in Berlin. <a href=" ">Check out how cool it is!</a>
            <br>
            </br>
            2. How does it work? <br>
            </br>
            Register and get in touch with other blockchain experts nearby. When you like someone, increase their reputation by sending an endorsement on the Ethereum Rinkeby blockchain (download and install <a href=" ">Metamask</a> to use CG to its full extent).
        <br>
            </br>
            3. How can I get GEEK tokens? <a href=" ">Read this</a> to get your GEEK tokens.
        </div>
          <form>
          <button onClick={this.closeModal}>close</button>
          </form>
        </Modal>
      </div>
    );
  }
}
