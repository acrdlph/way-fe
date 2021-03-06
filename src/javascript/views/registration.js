import React from 'react';
import { connect } from 'react-redux';
import {
  Form, FormGroup, FormFeedback, Input, Button,
} from 'reactstrap';
import { checkUsernameAvailability, registerAccount } from '../stores/accountStore';
import interactionConfirmationStore from '../stores/interactionConfirmationStore';
import { trackPageView, trackEvent, events } from '../util/google-analytics';
import InfoBox from '../components/infobox';
import CircularProgress from '../components/circularProgress';
import { renderLocationInput, saveAndContinue } from '../util/location';
import TermBox from '../components/termBox';
import './registration.less';

const validateUsername = (username) => {
  if (username && username.trim().length > 2) {
    // TODO: implement real validation
    return true;
  }
  return false;
};

const validateEmailAddress = (email) => {
  if (email && email.trim().length > 4) {
    // src: https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email.toLowerCase());
  }
  return false;
};

const validatePassword = (password) => {
  if (password && password.trim().length > 3) {
    // TODO: implement real validation
    return true;
  }
  return false;
};

class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    const path = this.props.location.pathname;
    trackPageView(path);

    this.state = {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      errorText: null,
      showLocationRequiredHint: false,
      isSearchBoxVisible: false,
    };

    this.register = this.register.bind(this);
    this.showSearchBox = this.showSearchBox.bind(this);
    this.showLocationRequired = this.showLocationRequired.bind(this);
    this.toggleDiv = this.toggleDiv.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.goToLogin = this.goToLogin.bind(this);
  }

  componentDidMount() {
    // autofocus on username input
    this.inputUsername.focus();
  }

  componentWillReceiveProps(props) {
    if (props.account.wasRegistrationSuccessful && !this.props.account.wasRegistrationSuccessful) {
      sessionStorage.setItem('userId', props.account.userId);
      sessionStorage.setItem('distance', 5000);
      trackEvent(events.USER_REGISTERED_ACCOUNT);

      // confirm interaction (for users who joined via waytcoin challenge)
      const interactionCode = sessionStorage.getItem('interactionCode');
      if (interactionCode) {
        this.props.confirmInteraction(interactionCode, props.account.userId);
      }
      saveAndContinue(
        this.showLocationRequired,
        this.showSearchBox,
        this.props.history,
        this.toggleDiv,
      );
    }
  }

  showSearchBox() {
    this.setState({ isSearchBoxVisible: true });
  }

  showLocationRequired() {
    this.setState({ showLocationRequiredHint: true });
  }

  goToLogin() {
    this.props.history.push('/signup');
  }

  toggleDiv() {
    const { show } = this.state;
    this.setState({ show: !show });
  }

  handleKeyPress = (target, event) => {
    // move cursor to next input on enter
    if (event.key === 'Enter') {
      switch (target) {
        case 'inputUsername':
          this.inputEmail.focus();
          break;
        case 'inputEmail':
          this.inputPassword.focus();
          break;
        case 'inputPassword':
          this.inputPasswordConfirm.focus();
          break;
        case 'inputPasswordConfirm':
          // register user on enter
          this.register();
          break;
        default:
          this.inputUsername.focus();
      }
    }
  };

  handleInputChange(event) {
    const { target } = event;
    const { value, name } = target;
    name === 'username' && this.props.checkUsernameAvailability(value);
    this.setState({ [name]: value });
  }

  register() {
    const {
      username, email, password, passwordConfirm,
    } = this.state;
    const { isAvailable } = this.props.account;

    if (!validateUsername(username)) {
      this.setState({
        errorText: 'Username too short!',
      });
    } else if (!validateEmailAddress(email)) {
      this.setState({
        errorText: 'Please enter a valid email address!',
      });
    } else if (!validatePassword(password) || password !== passwordConfirm) {
      this.setState({
        errorText: 'Password has to be at least 4 characters long!',
      });
    } else {
      this.setState({
        errorText: null,
      });
      if (isAvailable) {
        const data = {
          user_id: sessionStorage.getItem('userId'),
          username,
          email,
          password,
        };
        this.props.account.wasRegistrationSuccessful
          ? saveAndContinue(
            this.showLocationRequired,
            this.showSearchBox,
            this.props.history,
            this.toggleDiv,
          )
          : this.props.registerAccount(data);
      }
    }
  }

  render() {
    const { errorText, username } = this.state;
    const { isCheckingAvailability, isAvailable, isRegisteringAccount } = this.props.account;
    const { name } = this.props;
    const isUsernameTaken = !!username && isAvailable == false;
    const isRegistrationButtonDisabled = isRegisteringAccount;

    return (
      <div className="registrationContainer">
        <div className="registrationBox">
          <div className="arrowBox">
            <img src="assets/40-icon-back.svg" alt="arrow backward" onClick={this.goToLogin} />
          </div>
          <div className="textBox">
            <h3>Get started</h3>
            <p>
              You are one step away from the community of trusted blockchain experts & entrepreneurs
              from Berlin.
            </p>
          </div>
          <div className="recoverBox">
            <Form>
              <FormGroup>
                <Input
                  placeholder="Username"
                  name="username"
                  ref={(input) => {
                    this.inputUsername = input;
                  }}
                  invalid={errorText === 'Username too short!' || isUsernameTaken}
                  onKeyUp={this.handleKeyPress.bind(this, 'inputUsername')}
                  onChange={this.handleInputChange}
                />
                {isUsernameTaken ? (
                  <FormFeedback>The selected username is already taken!</FormFeedback>
                ) : (
                  <FormFeedback>Username too short!</FormFeedback>
                )}

                <Input
                  name="email"
                  placeholder="Email"
                  ref={(input) => {
                    this.inputEmail = input;
                  }}
                  invalid={
                    errorText === 'Please enter a valid email address!'
                    || this.props.account.hasRegisteringFailed
                  }
                  onKeyUp={this.handleKeyPress.bind(this, 'inputEmail')}
                  onChange={this.handleInputChange}
                />
                {this.props.account.hasRegisteringFailed ? (
                  <FormFeedback>This email is already in use</FormFeedback>
                ) : (
                  <FormFeedback>Please enter a valid email address!</FormFeedback>
                )}

                <Input
                  name="password"
                  placeholder="Password"
                  type="Password"
                  ref={(input) => {
                    this.inputPassword = input;
                  }}
                  invalid={errorText === 'Password has to be at least 4 characters long!'}
                  onKeyUp={this.handleKeyPress.bind(this, 'inputPassword')}
                  onChange={this.handleInputChange}
                />

                <Input
                  name="passwordConfirm"
                  placeholder="Password confirmation"
                  type="Password"
                  ref={(input) => {
                    this.inputPasswordConfirm = input;
                  }}
                  invalid={errorText === 'Password has to be at least 4 characters long!'}
                  onKeyUp={this.handleKeyPress.bind(this, 'inputPasswordConfirm')}
                  onChange={this.handleInputChange}
                />
                <FormFeedback>Password has to be at least 4 characters long!</FormFeedback>
                <div className="topCircular">
                  {renderLocationInput(
                    this.state.isSearchBoxVisible,
                    this.state.showLocationRequiredHint,
                  )}
                  {this.state.show && CircularProgress()}
                </div>
              </FormGroup>
            </Form>
            <Button onClick={this.register} disabled={isRegistrationButtonDisabled}>
              Get Started
            </Button>
            <div className="signinBox">
              <p>
                Already have an account?
                {' '}
                <a onClick={this.goToLogin}>
                  Sign in to CryptoGeeks
                  {' '}
                  <img src="assets/10-icon-bars_2.svg" alt="arrow forward" className="arrow" />
                </a>
              </p>
            </div>
          </div>
        </div>
        <TermBox
          goToFeedback={() => this.props.history.push('/feedback')}
          history={this.props.history}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
  name: state.user.data.name,
});

const mapDispatchToProps = dispatch => ({
  checkUsernameAvailability: username => dispatch(checkUsernameAvailability(username)),
  registerAccount: data => dispatch(registerAccount(data)),
  confirmInteraction: (confirmationCode, confirmorId) => dispatch(
    interactionConfirmationStore.actions.send({
      confirmationCode,
      confirmorId,
    }),
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Onboarding);
