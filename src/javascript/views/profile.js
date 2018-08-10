<<<<<<< HEAD
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from '../components/avatar';
import { trackPageView } from '../util/google-analytics';
import TermsAndPolicy from '../components/terms-and-policy';
import InfoBox from '../components/infobox';
import { Grid, Row, Col } from 'react-bootstrap';
import ImageSelection from '../components/image-selection-modal';
import { showModal } from '../stores/profileImageStore';
import { loadUserData, updateUserData, editUserData, isOnboarded } from '../stores/userStore';
import './profile.less';
import { Web3Provider } from 'react-web3';
import Web3Component, { initContract, getWeb3, contractAddress } from '../components/Web3Component';
import Blockgeeks from '../../abi/Blockgeeks.json';
import { isLoggedIn } from '../stores/accountStore';
import WaitListItem from '../components/waitlist-item';
import {LineChart} from 'react-easy-chart';

=======
import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import { Web3Provider } from "react-web3";
import { Grid, Row, Col } from "react-bootstrap";
import Avatar from "../components/avatar";
import { trackPageView } from "../util/google-analytics";
import TermsAndPolicy from "../components/terms-and-policy";
import InfoBox from "../components/infobox";
import ImageSelection from "../components/image-selection-modal";
import { showModal } from "../stores/profileImageStore";
import {
  loadUserData,
  updateUserData,
  editUserData,
  isOnboarded
} from "../stores/userStore";
import "./profile.less";
import Web3Component, {
  initContract,
  getWeb3,
  contractAddress
} from "../components/Web3Component";
import Blockgeeks from "../../abi/Blockgeeks.json";
import { isLoggedIn } from "../stores/accountStore";
import WaitListItem from "../components/waitlist-item";
>>>>>>> d35a92ab174ac6eb667ba8bf19ba437f7fa59310

class Profile extends React.Component {
  constructor(props) {
    super(props);
    if (this.props.location) {
      const path = this.props.location.pathname;
      trackPageView(path);
    }
    const userId = sessionStorage.getItem("userId");
    const usernameFromPath = _.get(this.props.match, "params.username");
    if (!usernameFromPath && (props.username || userId)) {
      this.props.history.push(`/profile/${props.username || userId}`);
    }
    this.props.loadUserData(usernameFromPath);
    this.onSave = this.onSave.bind(this);
    this.onBuyHandler = this.onBuyHandler.bind(this);
    this.onChanged = this.onChanged.bind(this);
    this.onImageClick = this.onImageClick.bind(this);
    this.refreshProfile = this.refreshProfile.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.getEtherPrice = this.getEtherPrice.bind(this);
    this.state = {
      name: this.props.name,
      email: this.props.email,
      username: this.props.username,
      interests: this.props.interests,
      balance: 0,
      endorsement: this.props.endorsement,
      address: web3.eth.accounts[0],
      tokenContract: initContract(Blockgeeks),
      priceToEther: null,
      metamaskConnected: false
    };
  }

  componentDidMount() {
    document.title = "Profile | CryptoGeeks";
  }

  componentWillReceiveProps(props) {
    const usernameFromPath = _.get(this.props.match, "params.username");
    if (props.username && props.username != usernameFromPath) {
      this.props.history.push(`/profile/${props.username}`);
    }

    const ethereumAddress = web3.eth.accounts[0];
    ethereumAddress
      ? this.state.tokenContract.balanceOf(ethereumAddress, (err, data) => {
          this.setState({
            balance: data.toNumber() / 10 ** 18,
            metamaskConnected: true
          });
        })
      : null;
  }

  refreshProfile() {
    const userId = sessionStorage.getItem("userId");
    this.props.loadUserData(userId);
  }

  onChanged(e) {
    const obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }

  _getBuyPrice(tokenAmount) {
    const getBuyPrice = this.state.tokenContract
      ? this.state.tokenContract.getBuyPrice
      : null;

    getBuyPrice(
      tokenAmount * 10 ** 18,
      {
        from: window.web3.eth.accounts ? window.web3.eth.accounts[0] : null,
        gas: 300000,
        value: 0
      },
      (error, data) => {
        this.setState({ priceToEther: web3.fromWei(data.toNumber(), "ether") });
      }
    );
  }

  getEtherPrice(e) {
    this._getBuyPrice(this.state.token_amount ? this.state.token_amount : 0);
  }

  onBuyHandler(e) {
    const onBuy = this.state.tokenContract
      ? this.state.tokenContract.buyTokens
      : null;
    const price = this.state.priceToEther;

    try {
     
      onBuy(
        this.state.token_amount * 10 ** 18,
        {
          from: window.web3.eth.accounts ? window.web3.eth.accounts[0] : null,
          gas: 300000,
          value: web3.toWei(price, "ether")
        },
        (error, result) => {
          console.log("Result", result);
          console.error("error", error);
        }
      );
    } catch (error) {
      alert(error, "Metamask is not connected");
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
    this.props.history.push("/");
    location.reload();
  }

  onSave(e) {
    // this for test Save button
    this.props.history.push("/waitlist");
    if (!this.props.isRegisteredUser) {
      this.props.history.push("/waitlist");
    }
    const userId = sessionStorage.getItem("userId");
    const data = {
      name: this.state.name,
      interests: this.state.interests
    };
    this.props.updateUserData(userId, data);
  }

<<<<<<< HEAD



  render() {

    const createBackButton = (to) => {
      return (
        <NavLink to={to}>
          <span className="glyphicon glyphicon glyphicon-chevron-left"/>
        </NavLink>
      );
    };
    let backButton = createBackButton('/waitlist');
    console.log("123456789asdfg", backButton);
    const { username, name, interests, photo, waytcoins, endorsement } = this.props;
    const photoUrl = photo || 'assets/avatar-placeholder.png';
    const imageSelectionModal = this.props.showModal ?
      <ImageSelection onUpload={this.refreshProfile} /> : null;
=======
  render() {
    const createBackButton = to => (
      <NavLink to={to}>
        <span className="glyphicon glyphicon glyphicon-chevron-left" />
      </NavLink>
    );
    const backButton = createBackButton("/waitlist");
    const {
      username,
      name,
      interests,
      photo,
      waytcoins,
      endorsement
    } = this.props;
    const photoUrl = photo || "assets/avatar-placeholder.png";
    const imageSelectionModal = this.props.showModal ? (
      <ImageSelection onUpload={this.refreshProfile} />
    ) : null;
>>>>>>> d35a92ab174ac6eb667ba8bf19ba437f7fa59310
    const logoutButton = this.props.isRegisteredUser ? (
      <div className="profile-button profile-button-logout">
        <RaisedButton
          onClick={this.onLogout}
          buttonStyle={{ border: " 1px solid darkred" }}
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
    return (
      <Grid className="profile">
        <NavLink to="/waitlist">
          <img className="logo-profile" src="assets/icon.png" />
        </NavLink>
        <Row>
          <Col sm={12}>
            <Avatar src={photoUrl} onClick={this.onImageClick} displayPlus />
            {imageSelectionModal}
          </Col>
        </Row>
        <p />
        <Row>
          <Col sm={12}>
            <h3>
              <strong>{username}</strong>
            </h3>
            <div className="profile-eth-adress">
              <h6>
                {" "}
                Your ETH-Adress:
                {getWeb3().eth.accounts[0]}{" "}
              </h6>
              <Web3Provider>
                <Web3Component />
              </Web3Provider>
            </div>
            Your balance: {this.state.balance}
            <p />
            Your reputation: {endorsement}
          </Col>
        </Row>
<<<<<<< HEAD
        <Row>
          <Col sm={6}>
            <TextField
              name="token_amount"
              hintText="Desired token amount"
              onChange={this.onChanged}
              fullWidth={false}
            />
            <label>{this.state.priceToEther}</label>
          </Col>
          <Col sm={6}>
            <div className='profile-button profile-button-save'>
              <RaisedButton
                onClick={this.getEtherPrice}
                backgroundColor='#00cf70'
                label={'Get price (ETH)'}
              />
            </div>
            <RaisedButton
              onClick={this.onBuyHandler}
              backgroundColor='#00cf70'
              label={'Buy'}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <LineChart
              width={800}
              height={250}
              data={[
                [
                  { x: 1, y: 20 },
                  { x: 2, y: 10 },
                  { x: 3, y: 25 }
                ], [
                  { x: 1, y: 10 },
                  { x: 2, y: 12 },
                  { x: 3, y: 4 }
                ]
              ]}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
          <font size="1">
              Contract: <a href="https://rinkeby.etherscan.io/address/0xbaa593e9c1f11bbcfa4725085211d764eec26592" target="_blank">0xbaa593e9c1f11bbcfa4725085211d764eec26592</a>
            </font>
          </Col>
        </Row>
        <Row>
          <Col sm={12}>
            <TextField
              name="name"
              defaultValue={name}
              hintText="Name"
              onChange={this.onChanged}
              fullWidth={true}
            />
            <TextField
              name="interests"
              defaultValue={interests}
              hintText="What are your incentives?"
              onChange={this.onChanged}
              fullWidth={true}
            />
          </Col>
        </Row>
        <div className='profile-button profile-button-save'>
=======
        {this.state.metamaskConnected && (
          <div>
            <Row>
              <Col sm={6}>
                <TextField
                  name="token_amount"
                  hintText="Desired token amount"
                  onChange={this.onChanged}
                  fullWidth={false}
                />
                <label>{this.state.priceToEther}</label>
              </Col>
              <Col sm={6}>
                <div className="profile-button profile-button-save">
                  <RaisedButton
                    onClick={this.getEtherPrice}
                    backgroundColor="#00cf70"
                    label="Get price (ETH)"
                  />
                </div>
                <RaisedButton
                  onClick={this.onBuyHandler}
                  backgroundColor="#00cf70"
                  label="Buy"
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12}>
                <font size="1">
                  Contract:{" "}
                  <a
                    href="https://rinkeby.etherscan.io/address/0xbaa593e9c1f11bbcfa4725085211d764eec26592"
                    target="_blank"
                  >
                    0xbaa593e9c1f11bbcfa4725085211d764eec26592
                  </a>
                </font>
              </Col>
            </Row>

            <Row>
              <Col sm={12}>
                <TextField
                  name="name"
                  defaultValue={name}
                  hintText="Name"
                  onChange={this.onChanged}
                  fullWidth
                />
                <TextField
                  name="interests"
                  defaultValue={interests}
                  hintText="What are your incentives?"
                  onChange={this.onChanged}
                  fullWidth
                />
              </Col>
            </Row>
          </div>
        )}
        <div className="profile-button profile-button-save">
>>>>>>> d35a92ab174ac6eb667ba8bf19ba437f7fa59310
          <RaisedButton
            onClick={this.onSave}
            backgroundColor="#00cf70"
            label={this.props.isRegisteredUser ? "Save" : "Register"}
          />
        </div>
        <p />
        <Row>
          <Col sm={12}>
            <div>{logoutButton}</div>
          </Col>
        </Row>
      </Grid>
    );
  }
}
const mapStateToProps = state => {
  return {
    ...state.user.data,
    isRegisteredUser: !!state.user.data.username,
    showModal: state.profileImage.showModal
  };
};
const mapDispatchToProps = dispatch => ({
  loadUserData: userId => dispatch(loadUserData(userId)),
  updateUserData: (userId, data) => dispatch(updateUserData(userId, data)),
  openModal: () => dispatch(showModal(true))
});
<<<<<<< HEAD
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
=======
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
>>>>>>> d35a92ab174ac6eb667ba8bf19ba437f7fa59310
