import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import { Web3Provider } from 'react-web3';
import { LineChart } from 'react-easy-chart';
import {
  Form, FormGroup, Input, Label, Button,
} from 'reactstrap';
import Bookmark from 'material-ui/svg-icons/action/bookmark';
import Swap from 'material-ui/svg-icons/action/swap-horiz';
import Avatar from '../components/avatar';
import { trackPageView } from '../util/google-analytics';
import ImageSelection from '../components/image-selection-modal';
import { showModal } from '../stores/profileImageStore';
import {
  loadUserData, updateUserData, editUserData, isOnboarded,
} from '../stores/userStore';
import './profile.less';
import Web3Component, { initContract, getWeb3, contractAddress } from '../components/Web3Component';
import Blockgeeks from '../../abi/Blockgeeks.json';

const multiplier = 10 ** 18;

class Profile extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.location) {
      const path = this.props.location.pathname;
      trackPageView(path);
    }
    const userId = sessionStorage.getItem('userId');
    const usernameFromPath = _.get(this.props.match, 'params.username');
    if (!usernameFromPath && (props.username || userId)) {
      this.props.history.push(`/profile/${props.username || userId}`);
    }
    this.props.loadUserData(usernameFromPath);
    this.onSave = this.onSave.bind(this);
    this.onBuyHandler = this.onBuyHandler.bind(this);
    this.onSellHandler = this.onSellHandler.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onImageClick = this.onImageClick.bind(this);
    this.refreshProfile = this.refreshProfile.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.getEtherPrice = this.getEtherPrice.bind(this);
    this.state = {
      name: this.props.user.name,
      email: this.props.user.email,
      username: this.props.user.username,
      interests: this.props.user.interests,
      balance: 0,
      endorsement: this.props.endorsement,
      address: window.web3 ? window.web3.eth.accounts[0] : null,
      tokenContract: initContract(Blockgeeks),
      priceToEther: null,
      metamaskConnected: false,
    };
  }

  componentDidMount() {
    document.title = 'Profile | CryptoGeeks';
  }

  componentWillReceiveProps(props) {
    const usernameFromPath = _.get(this.props.match, 'params.username');
    if (props.username && props.username != usernameFromPath) {
      this.props.history.push(`/profile/${props.username}`);
    }

    const ethereumAddress = window.web3 ? window.web3.eth.accounts[0] : null;
    ethereumAddress
      ? this.state.tokenContract.balanceOf(ethereumAddress, (err, data) => {
        this.setState({
          balance: data.toNumber() / multiplier,
          metamaskConnected: true,
        });
      })
      : null;
    this._getTotalSupply();
    this.setState({
      name: props.user.name,
      interests: props.user.interests,
      email: props.user.email,
      username: props.user.username,
      endorsement: props.user.endorsement,
    });
  }

  onSave(event) {
    const userId = sessionStorage.getItem('userId');
    let data;
    if (event.target.name === 'nameInterest') {
      data = {
        name: this.state.name,
        interests: this.state.interests,
      };
    } else if (event.target.name === 'emailUsername') {
      data = {
        email: this.state.email,
        username: this.state.username,
      };
    }
    this.props.updateUserData(userId, data);
  }

  handleInputChange(event) {
    const { target } = event;
    const { value, name } = target;
    this.setState({ [name]: value });
  }

  refreshProfile() {
    const userId = sessionStorage.getItem('userId');
    this.props.loadUserData(userId);
  }

  _getBuyPrice(tokenAmount) {
    const getBuyPrice = this.state.tokenContract ? this.state.tokenContract.getBuyPrice : null;
    window.web3
      && getBuyPrice(
        tokenAmount * 10 ** 18,
        {
          from: window.web3.eth.accounts ? window.web3.eth.accounts[0] : null,
          gas: 300000,
          value: 0,
        },
        (error, data) => {
          this.setState({ priceToEther: web3.fromWei(data.toNumber(), 'ether') });
        },
      );
  }

  _getTotalSupply() {
    const getTotalSupply = this.state.tokenContract ? this.state.tokenContract.totalSupply : null;
    window.web3
      && getTotalSupply(
        {
          from: window.web3.eth.accounts ? window.web3.eth.accounts[0] : null,
          gas: 300000,
          value: 0,
        },
        (error, data) => {
          this.setState({ totalSupply: data.toNumber() });
          this.state, 'totalSupply';
        },
      );
  }

  onBuyHandler(e) {
    const onBuy = this.state.tokenContract ? this.state.tokenContract.buyTokens : null;
    const price = this.state.priceToEther;

    try {
      onBuy(
        this.state.token_amount * 10 ** 18,
        {
          from: window.web3 ? window.web3.eth.accounts[0] : null,
          gas: 300000,
          value: web3.toWei(price, 'ether'),
        },
        (error, result) => {
          console.log('Result', result);
          console.error('error', error);
        },
      );
    } catch (error) {
      alert(error, 'Metamask is not connected');
    }
  }

  getEtherPrice(e) {
    this._getBuyPrice(this.state.token_amount ? this.state.token_amount : 0);
  }

  onSellHandler(e) {
    const onSell = this.state.tokenContract ? this.state.tokenContract.sellTokens : null;

    try {
      onSell(
        this.state.token_amount * 10 ** 18,
        {
          from: window.web3 ? window.web3.eth.accounts[0] : null,
          gas: 300000,
          value: 0,
        },
        (error, result) => {
          console.log('Result', result);
          console.error('error', error);
        },
      );
    } catch (error) {
      alert(error, 'Metamask is not connected');
    }
  }

  onImageClick() {
    this.props.openModal();
  }

  onChangeImage(e) {
    console.log(e);
  }

  onLogout() {
    sessionStorage.clear();
    localStorage.clear();
    this.props.history.push('/');
    location.reload();
  }

  render() {
    const createBackButton = to => (
      <NavLink to={to}>
        <span className="glyphicon glyphicon glyphicon-chevron-left" />
      </NavLink>
    );
    const backButton = createBackButton('/waitlist');
    const {
      username, name, interests, photo, waytcoins, endorsement,
    } = this.props;
    const photoUrl = photo || 'assets/avatar-placeholder.png';
    const imageSelectionModal = this.props.showModal ? (
      <ImageSelection onUpload={this.refreshProfile} />
    ) : null;
    const logoutButton = this.props.isRegisteredUser ? (
      <div className="profile-button profile-button-logout">
        <RaisedButton
          onClick={this.onLogout}
          buttonStyle={{ border: ' 1px solid darkred' }}
          backgroundColor="white"
          label="logout"
        />
      </div>
    ) : null;

    const balance = (
      <div>
        <NavLink to="/challenge">
          <span className="profile-waytcoin-symbol">
            <img src="/assets/waytcoin-symbol.png" />
          </span>
        </NavLink>
        {waytcoins}
      </div>
    );
    const backing = (
      <div>
        <span className="profile-waytcoin-symbol">
          <img src="/assets/waytcoin-symbol.png" />
        </span>
        {waytcoins}
      </div>
    );
    const xAxis = this.state.totalSupply / multiplier;
    const yAxis = 0.0001 * xAxis;
    const curveData = [[{ x: 0, y: 0 }, { x: xAxis, y: yAxis }, { x: 10000, y: 1 }]];

    return (
      <div className="container">
        <div className="menuBox">
          <NavLink to="/">Profile</NavLink>
          <NavLink to="/">Token</NavLink>
          <NavLink to="/">Account</NavLink>
          <div>{logoutButton}</div>
          {/* <NavLink to="/">Security</NavLink>
          <NavLink onClick={this.onLogout}>Logout</NavLink> */}
        </div>
        <div className="profileContainer">
          <div className="repGeekBox">
            <div className="reputation">
              <Bookmark color="#6b8299" className="bookmark" />
              <div className="titleBox">
                <h5>
                  {this.state.endorsement}
                  {' '}
Reputation
                </h5>
                {/* <p>earned from 32 people</p> */}
              </div>
            </div>
            <span className="middleLine" />
            <div className="geek">
              <h4 className="geekG">G</h4>
              <div className="titleBox">
                <h5>
                  {this.state.balance}
                  {' '}
GEEK
                </h5>
                {/* <p>worth 0.0000 ETH</p> */}
              </div>
            </div>
          </div>
          <div className="profileBox">
            <h4>Profile</h4>
            <Avatar src={photoUrl} onClick={this.onImageClick} />
            {imageSelectionModal}
            <Form>
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  name="name"
                  placeholder="Insert your name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                />
                <p>We’re big fans of photos and real names here, so everyone knows who is who.</p>
              </FormGroup>
              <FormGroup>
                <Label for="incentive">Incentive</Label>
                <Input
                  name="interests"
                  placeholder="Let people know what you are up to & how they can help you"
                  value={this.state.interests}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="hangoutPlaces">Hangout places</Label>
                <Input placeholder="eg. coworking place, restaurant, bar" />
              </FormGroup>
            </Form>
            <div className="btnBox">
              <Button name="nameInterest" onClick={this.onSave} className="saveBtn">
                Save Changes
              </Button>
            </div>
          </div>
          <div className="tokenBox">
            <h4>Token</h4>
            {this.state.metamaskConnected ? (
              <div>
                <div className="buySelContainer">
                  <div className="buySellBox">
                    <NavLink to="/">Buy</NavLink>
                    <NavLink to="/">Sell</NavLink>
                  </div>
                </div>
                <p>Buy GEEK token from this bonding curve to start curating the community.</p>
                <Form className="swapBox">
                  <FormGroup>
                    <Label for="hangoutPlaces">Amount of Token</Label>
                    <Input type="number" placeholder="with a placeholder" />
                  </FormGroup>
                  <Swap color="#c3cfd9" className="swap" />
                  <FormGroup>
                    <Label for="hangoutPlaces">Price in ETH</Label>
                    <Input type="number" placeholder="with a placeholder" />
                  </FormGroup>
                </Form>
                <div className="buyBtnBox">
                  <Button className="buyBtn">Buy 100 GEEK on Testnet</Button>
                </div>
                <div className="bondingCurve">
                  <LineChart
                    axes
                    axisLabels={{ x: 'Token Supply', y: 'Current Price' }}
                    data={curveData}
                    dataPoints
                    margin={{
                      top: 30,
                      right: 30,
                      bottom: 50,
                      left: 70,
                    }}
                    width={500}
                    height={400}
                    style={{ '.label': { fill: 'black' } }}
                  />
                </div>
                <div className="contractDetails">
                  <p>See contract details:</p>
                  {' '}
                  <a
                    href="https://rinkeby.etherscan.io/address/0xbaa593e9c1f11bbcfa4725085211d764eec26592"
                    target="_blank"
                  >
                    0xbaa593e9c1f11bbcfa4725085211d764eec26592
                  </a>
                </div>
              </div>
            ) : (
              <h5>Please connect to metamask to enjoy blabla</h5>
            )}
          </div>
          <div className="accountBox">
            <h4>Account</h4>
            <Form>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input name="email" value={this.state.email} onChange={this.handleInputChange} />
              </FormGroup>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input
                  name="username"
                  value={this.state.username}
                  onChange={this.handleInputChange}
                />
              </FormGroup>
            </Form>
            <div className="btnBox">
              <Button name="emailUsername" onClick={this.onSave} className="saveBtn">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  user: state.user.data,
  isRegisteredUser: !!state.user.data.username,
  showModal: state.profileImage.showModal,
});
const mapDispatchToProps = dispatch => ({
  loadUserData: userId => dispatch(loadUserData(userId)),
  updateUserData: (userId, data) => dispatch(updateUserData(userId, data)),
  openModal: () => dispatch(showModal(true)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
