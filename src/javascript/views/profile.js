import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import {
  Form, FormGroup, Input, Label, Button,
} from 'reactstrap';
import Geosuggest from 'react-geosuggest';
import shortid from 'shortid';
import Avatar from '@material-ui/core/Avatar';
import { trackPageView } from '../util/google-analytics';
import ImageSelection from '../components/image-selection-modal';
import { showModal } from '../stores/profileImageStore';
import { updateUserData } from '../stores/userStore';
import './profile.less';
import Web3Component, { initContract, getWeb3, contractAddress } from '../components/Web3Component';
import Blockgeeks from '../../abi/Blockgeeks.json';
import HangoutPlace from '../components/hangoutPlace';
import CurveChart from '../components/Chart/Chart';

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
    this.onSave = this.onSave.bind(this);
    this.onBuyHandler = this.onBuyHandler.bind(this);
    this.onSellHandler = this.onSellHandler.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onImageClick = this.onImageClick.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.getEtherPrice = this.getEtherPrice.bind(this);
    this.onSuggestSelect = this.onSuggestSelect.bind(this);
    this.handleDeletePlace = this.handleDeletePlace.bind(this);
    this.changeTokenView = this.changeTokenView.bind(this);
    this.state = {
      name: this.props.user.name,
      email: this.props.user.email,
      username: this.props.user.username,
      interests: this.props.user.interests,
      hangoutPlaces: [],
      balance: null,
      endorsement: this.props.endorsement,
      address: window.web3 ? window.web3.eth.accounts[0] : null,
      tokenContract: initContract(Blockgeeks),
      priceToEther: null,
      priceToEtherSell: null,
      metamaskConnected: null,
      token_amount: 100,
      showBuy: true,
      balanceToEth: null,
      poolBalance: null,
    };
  }

  componentDidMount() {
    document.title = 'Profile | CryptoGeeks';
    this.getEtherPrice();
    this.getPoolBalance();
    web3
      && web3.currentProvider.publicConfigStore.on('update', () => this.setState({
        metamaskConnected: web3.eth.accounts[0],
      }));
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
        this._getSellReward(this.state.balance, 'worth');
      })
      : null;
    this._getTotalSupply();
    this.setState({
      name: props.user.name,
      interests: props.user.interests,
      email: props.user.email,
      username: props.user.username,
      endorsement: props.user.endorsement,
      hangoutPlaces: props.user.hangoutPlaces,
    });
  }

  onSave(event) {
    const userId = sessionStorage.getItem('userId');
    let data;
    if (event.target.name === 'nameInterest') {
      data = {
        name: this.state.name,
        interests: this.state.interests,
        hangoutPlaces: this.state.hangoutPlaces,
      };
    } else if (event.target.name === 'emailUsername') {
      data = {
        email: this.state.email,
        username: this.state.username,
      };
    }
    this.props.updateUserData(userId, data);
  }

  onSuggestSelect(suggest) {
    suggest !== undefined
      && this.setState({
        hangoutPlaces: [
          ...this.state.hangoutPlaces,
          {
            place: suggest.label.replace(/\,.*/, ''),
            id: shortid.generate(),
          },
        ],
      });
    this._geoSuggest.clear();
  }

  handleDeletePlace(id) {
    this.setState({ hangoutPlaces: this.state.hangoutPlaces.filter(place => place.id !== id) });
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

  _getSellReward(tokenAmount, calledFrom) {
    const getSellReward = this.state.tokenContract ? this.state.tokenContract.getSellReward : null;
    window.web3
      && getSellReward(
        tokenAmount * 10 ** 18,
        {
          from: window.web3.eth.accounts ? window.web3.eth.accounts[0] : null,
          gas: 300000,
          value: 0,
        },
        (error, data) => {
          calledFrom === 'getEtherPrice'
            ? this.setState({ priceToEtherSell: web3.fromWei(data.toNumber(), 'ether') })
            : this.setState({ balanceToEth: web3.fromWei(data.toNumber(), 'ether') });
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
    this._getSellReward(this.state.token_amount ? this.state.token_amount : 0, 'getEtherPrice');
  }

  getPoolBalance() {
    const getPoolbalance = this.state.tokenContract ? this.state.tokenContract.poolBalance : null;
    window.web3
      && getPoolbalance(
        {
          from: window.web3.eth.accounts ? window.web3.eth.accounts[0] : null,
          gas: 300000,
          value: 0,
        },
        (error, data) => {
          this.setState({ poolBalance: data.toNumber() });
          this.state, 'poolBalance';
        },
      );
  }

  handleInputChange(event) {
    const { target } = event;
    const { value, name } = target;
    this.setState({ [name]: value });
    setTimeout(() => this.getEtherPrice(), 10);
  }

  changeTokenView(showBuy) {
    this.setState({ showBuy });
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
    } = this.props.user;
    const photoUrl = photo || 'assets/32-icon-avatar.svg';
    const imageSelectionModal = this.props.showModal ? (
      <ImageSelection onUpload={this.refreshProfile} />
    ) : null;
    const logoutButton = (
      <a onClick={this.onLogout} className="logoutButton">
        Logout
      </a>
    );

    // invSlope is 10000 in the current (linear) bonding curve => price = 0.0001 * tokenSupply
    const xAxis = this.state.totalSupply / multiplier;
    const yAxis = 0.0001 * xAxis;
    const poolBalance = this.state.poolBalance / multiplier;

    return (
      <div className="accountContainer">
        <div className="menuBox">
          <NavHashLink smooth to={`/profile/${sessionStorage.getItem('userId')}#profile`}>
            Profile
          </NavHashLink>
          <NavHashLink
            to={`/profile/${sessionStorage.getItem('userId')}#token`}
            scroll={(el) => {
              window.scrollTo({
                top: 750,
                behavior: 'smooth',
              });
              console.log(el, 'hah');
            }}
          >
            Token
          </NavHashLink>
          <NavHashLink smooth to={`/profile/${sessionStorage.getItem('userId')}#account`}>
            Account
          </NavHashLink>
          {logoutButton}
          {/* <NavLink to="/">Security</NavLink>
          <NavLink onClick={this.onLogout}>Logout</NavLink> */}
        </div>
        <div className="profileContainer">
          <div className="repGeekBox">
            <div className="reputation">
              <img src="assets/48-icon-reputation.svg" color="#6b8299" className="bookmark" />
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
              <img src="assets/48-icon-token.png" className="bookmark" />
              <div className="titleBox">
                <h5>
                  {this.state.balance}
                  {' '}
GEEK
                </h5>
                <p>{`worth ${Number(this.state.balanceToEth).toFixed(2)} ETH`}</p>
              </div>
            </div>
          </div>
          <div className="profileBox">
            <h4>Profile</h4>
            <div className="titleAvatar">
              <Avatar className="avatar" src={photoUrl} onClick={this.onImageClick} />
              {imageSelectionModal}
            </div>
            <Form id="profile">
              <FormGroup>
                <Label for="name">Name</Label>
                <Input
                  className="nameInput"
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
                <Geosuggest
                  ref={el => (this._geoSuggest = el)}
                  placeholder="eg. coworking place, restaurant, bar"
                  onSuggestSelect={this.onSuggestSelect}
                  location={new google.maps.LatLng(52.52, 13.405)}
                  radius="10000"
                />
              </FormGroup>
              {this.state.hangoutPlaces
                && this.state.hangoutPlaces.map(place => (
                  <HangoutPlace
                    key={place.id}
                    hangoutPlace={place.place}
                    handleClick={this.handleDeletePlace}
                    id={place.id}
                  />
                ))}
            </Form>
            <div className="btnBox">
              <Button name="nameInterest" onClick={this.onSave} className="saveBtn">
                Save Changes
              </Button>
            </div>
          </div>
          <div className="tokenBox" id="token">
            <div className="tokenLive">
              <h4>Token</h4>
              <div className="metaMask">
                {this.state.metamaskConnected
                  && (web3.version.network === '4' ? (
                    <p>
                      <span className="greendot" />
                      {' '}
Live on the
                      <b> Rinkeby Testnet</b>
                    </p>
                  ) : (
                    <p>
                      <span className="reddot" />
                      {' '}
Please connect to the
                      <b> Rinkeby Testnet</b>
                    </p>
                  ))}
              </div>
            </div>
            {this.state.metamaskConnected ? (
              <div>
                <div className="buySelContainer">
                  <div className="buySellBox">
                    <span
                      className={this.state.showBuy ? 'active' : ''}
                      onClick={() => this.changeTokenView(true)}
                    >
                      Buy
                    </span>
                    <span
                      className={!this.state.showBuy ? 'active' : ''}
                      onClick={() => this.changeTokenView(false)}
                    >
                      Sell
                    </span>
                  </div>
                </div>
                {this.state.showBuy ? (
                  <div>
                    <p>Buy GEEK token from this bonding curve to start curating the community.</p>
                    <Form className="swapBox">
                      <FormGroup>
                        <Label for="hangoutPlaces">Amount of Token</Label>
                        <Input
                          name="token_amount"
                          type="number"
                          value={this.state.token_amount}
                          onChange={this.handleInputChange}
                        />
                      </FormGroup>
                      <img src="assets/20-icon-lock_2.svg" color="#c3cfd9" className="swap" />
                      <FormGroup>
                        <Label for="hangoutPlaces">Price in ETH</Label>
                        <Input type="number" value={this.state.priceToEther} />
                      </FormGroup>
                    </Form>
                    <div className="buyBtnBox">
                      <Button className="buyBtn" onClick={e => this.onBuyHandler(e)}>
                        {`Buy ${this.state.token_amount} GEEK on Testnet`}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p>Sell GEEK token back to the bonding curve to cash out and receive ETH.</p>
                    <Form className="swapBox">
                      <FormGroup>
                        <Label for="hangoutPlaces">Amount of Token</Label>
                        <Input
                          name="token_amount"
                          type="number"
                          value={this.state.token_amount}
                          onChange={this.handleInputChange}
                        />
                      </FormGroup>
                      <img src="assets/20-icon-lock_2.svg" color="#c3cfd9" className="swap" />
                      <FormGroup>
                        <Label for="hangoutPlaces">Price in ETH</Label>
                        <Input type="number" value={this.state.priceToEtherSell} />
                      </FormGroup>
                    </Form>
                    <div className="buyBtnBox">
                      <Button className="buyBtn" onClick={e => this.onSellHandler(e)}>
                        {`Sell ${this.state.token_amount} GEEK on Testnet`}
                      </Button>
                    </div>
                  </div>
                )}
                <div className="bondingCurve">
                  <CurveChart
                    curveData={{
                      totalSupply: xAxis,
                      poolBalance,
                      invSlope: 10000,
                      exponent: 1,
                      currentPrice: yAxis,
                    }}
                    margin={{
                      top: 30,
                      right: 30,
                      bottom: 50,
                      left: 70,
                    }}
                    width={500}
                    height={400}
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
              <div className="alertRedBox">
                <img src="assets/48-icon-reputation.svg" color="#6b8299" className="bookmark" />
                <div>
                  <h5>No ETH address connected</h5>
                  <p>Please make sure your Ethereum client is connected.</p>
                </div>
              </div>
            )}
          </div>
          <div className="accountBox" id="account">
            <h4>Account</h4>
            <Form>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input name="email" value={this.state.email} onChange={this.handleInputChange} />
              </FormGroup>
              <FormGroup>
                <Label for="username">Username</Label>
                <div className="inputIcon">
                  <img src="assets/20-icon-lock.svg" />
                  <Input
                    className="disabledInput"
                    disabled
                    name="username"
                    value={this.state.username}
                  />
                </div>
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
  updateUserData: (userId, data) => dispatch(updateUserData(userId, data)),
  openModal: () => dispatch(showModal(true)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile);
