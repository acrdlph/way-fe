import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Web3Provider } from 'react-web3';
import { LineChart } from 'react-easy-chart';
import { Form, FormGroup, Input, Label, Button } from 'reactstrap';
import Avatar from '../components/avatar';
import { trackPageView } from '../util/google-analytics';
import Bookmark from 'material-ui/svg-icons/action/bookmark';
import Swap from 'material-ui/svg-icons/action/swap-horiz';
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
  }

  refreshProfile() {
    const userId = sessionStorage.getItem('userId');
    this.props.loadUserData(userId);
  }

  onChanged(e) {
    const obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
  }

  _getBuyPrice(tokenAmount) {
    const getBuyPrice = this.state.tokenContract ? this.state.tokenContract.getBuyPrice : null;

    getBuyPrice(
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

    getTotalSupply(
      {
        from: window.web3.eth.accounts ? window.web3.eth.accounts[0] : null,
        gas: 300000,
        value: 0,
      },
      (error, data) => {
        this.setState({ totalSupply: data.toNumber() });
      },
    );
  }

  getEtherPrice(e) {
    this._getBuyPrice(this.state.token_amount ? this.state.token_amount : 0);
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

  handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      this.inputInterest.focus();
    }
  }

  onLogout() {
    sessionStorage.clear();
    localStorage.clear();
    this.props.history.push('/');
    location.reload();
  }

  onSave(e) {
    // this for test Save button
    this.props.history.push('/waitlist');
    if (!this.props.isRegisteredUser) {
      this.props.history.push('/waitlist');
    }
    const userId = sessionStorage.getItem('userId');
    const data = {
      name: this.state.name,
      interests: this.state.interests,
    };
    this.props.updateUserData(userId, data);
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
          <NavLink to="/">Amount</NavLink>
          <NavLink to="/">Token</NavLink>
          <NavLink to="/">Security</NavLink>
          <NavLink to="/">Logout</NavLink>
        </div>
        <div className="profileContainer">
          <div className="repGeekBox">
            <div className="reputation">
              <Bookmark color="#6b8299" className="bookmark" />
              <div className="titleBox">
                <h5>1047 Reputation</h5>
                <p>earned from 32 people</p>
              </div>
            </div>
            <span className="middleLine"></span>
            <div className="geek">
              <h4 className="geekG">G</h4>
              <div className="titleBox">
                <h5>0,00 GEEK</h5>
                <p>worth 0.0000 ETH</p>
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
                <Input placeholder="with a placeholder" />
              </FormGroup>
              <FormGroup>
                <Label for="incentive">Incentive</Label>
                <Input placeholder="with a placeholder" />
              </FormGroup>
              <FormGroup>
                <Label for="hangoutPlaces">Hangout places</Label>
                <Input placeholder="with a placeholder" />
              </FormGroup>
            </Form>
            <div className="btnBox">
              <Button className="saveBtn">Save Changes</Button>
            </div>
          </div>
          <div className="tokenBox">
            <h4>Token</h4>
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
          </div>
          <div className="accountBox">
            <h4>Account</h4>
            <Form>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input placeholder="with a placeholder" />
              </FormGroup>
              <FormGroup>
                <Label for="username">Username</Label>
                <Input placeholder="with a placeholder" />
              </FormGroup>
            </Form>
            <div className="btnBox">
              <Button className="saveBtn">Save Changes</Button>
            </div>
          </div>
        </div>

        {/*
      <Grid className="profile">
      
        <NavLink to="/waitlist">
          <img className="logo-profile" src="assets/icon.png" />
        </NavLink>
      
        <Row>
          <Col sm={12} md={2}>
            <Avatar src={photoUrl} onClick={this.onImageClick} displayPlus />
            {imageSelectionModal}
          </Col>

          <Col sm={8} md={7}>
            <TextField
              name="name"
              defaultValue={name}
              hintText="Name"
              ref={(input) => {this.inputName = input}}
              onKeyPress={this.handleKeyPress}
              onChange={this.onChanged}
              fullWidth
            />
            <TextField
              name="interests"
              defaultValue={interests}
              hintText="What are your incentives?"
              ref={(input) => {this.inputInterest = input}}
              onChange={this.onChanged}
              fullWidth
            />
          </Col>

          <Col sm={4} md={3} className="buttonBox">
            <div className="profile-button profile-button-save">
              <div>{logoutButton}</div>

              <RaisedButton
                className="save-button"
                onClick={this.onSave}
                backgroundColor="#00cf70"
                label={this.props.isRegisteredUser ? 'Save' : 'Register'}
              />
            </div>
          </Col>
        </Row>

        <Row className="info-row">
          <Web3Provider>
            <Web3Component />
          </Web3Provider>
          <Col lg={4} sm={12} className="user-info-profile">
            <h3 className="username-profile">
              <strong>{username}</strong>
            </h3>
            <Col sm={12}>
              <div className="profile-eth-adress">
                <h6 className="ethAddress">
                  {' '}
                  Your ETH-Address:
                  <font size="1">
                    {window.web3 && getWeb3().eth.accounts[0]}
                    {' '}
                  </font>
                </h6>
              </div>
            </Col>
            <Col sm={12}>
              <Col>
                Your GEEK balance:
                {` ${this.state.balance}`}
              </Col>
              <Col>
                Your GEEK reputation:
                {` ${endorsement}`}
              </Col>
            </Col>
          </Col>

          {this.state.metamaskConnected && (
            <Col lg={8} sm={12} className="profile-token-curve">
              <Col className="info-text">
                <h6>
                  Live on the
                  {' '}
                  <u>
                    <b>Rinkeby</b>
                  </u>
                  {' '}
                  Testnet
                </h6>
                <p>Buy GEEK token from this bonding curve to start curating the community.</p>

                <TextField
                  className="tokenField"
                  name="token_amount"
                  hintText="GEEK token amount"
                  onChange={this.onChanged}
                  fullWidth={false}
                />
                <label>{this.state.priceToEther}</label>
                <Col sm={12}>
                  <RaisedButton
                    className="get-price-button"
                    onClick={this.getEtherPrice}
                    backgroundColor="#00cf70"
                    label="Get price (ETH)"
                  />
                  <RaisedButton
                    className="get-price-button"
                    onClick={this.onBuyHandler}
                    backgroundColor="#00cf70"
                    label="Buy"
                  />
                  <RaisedButton onClick={this.onSellHandler} backgroundColor="white" label="Sell" />
                </Col>
              </Col>

              <Col className="info-graph">
                <Col sm={12}>
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
                  <font size="1">
                    Contract:
                    {' '}
                    <a
                      href="https://rinkeby.etherscan.io/address/0xbaa593e9c1f11bbcfa4725085211d764eec26592"
                      target="_blank"
                    >
                      0xbaa593e9c1f11bbcfa4725085211d764eec26592
                    </a>
                  </font>
                </Col>
              </Col>
            </Col>
          )}
        </Row>
      </Grid>
      */}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  ...state.user.data,
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
