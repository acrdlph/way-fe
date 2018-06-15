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

          <u>Cryptogeeks.Berlin: The first token-curated ranking of  trusted blockchain experts.</u>
          <br>
          </br>
          
          <h2 ref={subtitle => this.subtitle = subtitle}>Instructions</h2>

          <div>
            <b>1. Register </b><br>
            </br>
            Activate <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en" target="_blank">MetaMask</a> <i> on the Rinkeby testnet </i>, register your Cryptogeeks profile and get in touch with blockchain experts nearby.
            <br>
            </br>
            <br>
            </br>
            <b>2. Get GEEK tokens </b>
            <br>
            </br>
            Go to the profile page to buy GEEK token with <a href="https://faucet.rinkeby.io/" target="_blank">Rinkeby testnet Ether</a> (MetaMask is required for this step).
            <br>
            </br>
            <br>
            </br>
            <b>3. Curate the community </b> 
            <br>
            </br>
             When you like someone, increase their reputation by sending an endorsement on the blockchain. <a href="https://medium.com/@w.a.y/cryptogeeks-unite-f0c5c39b30e5" target="_blank">Here</a> is how it works in detail.
            <br>
            </br>
            <br>
            </br>

        </div>
          <form>
          <button onClick={this.closeModal}>Continue</button>
          </form>
        </Modal>
      </div>
    );
  }
}
