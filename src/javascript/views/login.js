import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import { trackPageView, trackEvent, events } from '../util/google-analytics';
import InfoBox from '../components/infobox';
import { login } from '../stores/accountStore';
import { saveAndContinue } from '../util/location';
import './login.less';

const calledFrom = 'login';

class Login extends React.Component {
  constructor(props) {
    super(props);
    const path = this.props.pathname;
    trackPageView(path);

    this.state = {
      loginName: '',
      password: '',
    };

    this.login = this.login.bind(this);
    this.changeLoginName = this.changeLoginName.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  componentDidMount() {
    document.title = 'Login | CryptoGeeks';
    // autofocus on username input
    this.inputUsername.focus();
  }

  componentWillReceiveProps(props) {
    if (props.account.wasLoginSuccessful && !this.props.account.wasLoginSuccessful) {
      sessionStorage.setItem('userId', props.account.userId);
      trackEvent(events.USER_LOGGED_IN);
    }
  }

  changeLoginName(event) {
    this.setState({ loginName: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleKeyPress = (target, event) => {
    // move cursor to next input on enter
    if (event.key === 'Enter') {
      switch (target) {
        case 'inputUsername':
          this.inputPassword.focus();
          break;
        case 'inputPassword':
          // log user in on enter
          this.login();
          break;
        default:
          this.inputUsername.focus();
      }
    }
  };

  login() {
    const { loginName, password } = this.state;
    console.log(loginName, password);
    this.props.login(loginName, password);
    const { showLocationRequired, showSearchBox, history, toggleDiv } = this.props;
    saveAndContinue(showLocationRequired, showSearchBox, history, toggleDiv, calledFrom);
  }

  render() {
    return (
      <div className="login">
        <Form>
          <FormGroup>
            <Input
              className="username"
              placeholder="Username"
              floatingLabelText="Username or Email"
              ref={input => {
                this.inputUsername = input;
              }}
              onKeyPress={this.handleKeyPress.bind(this, 'inputUsername')}
              onChange={this.changeLoginName}
              fullWidth
            />

            <Input
              className="password"
              placeholder="Password"
              floatingLabelText="Password"
              type="Password"
              ref={input => {
                this.inputPassword = input;
              }}
              onKeyPress={this.handleKeyPress.bind(this, 'inputPassword')}
              onChange={this.changePassword}
              fullWidth
            />
          </FormGroup>
        </Form>

        <Button
          ref={input => {
            this.inputSubmit = input;
          }}
          onKeyPress={this.handleKeyPress.bind(this, 'inputSubmit')}
          onClick={this.login}
          fullWidth
        >
          Sign in
        </Button>

        <InfoBox text="Invalid username or password!" visible={this.props.account.hasLoginFailed} />

        {/* <div className='login-reset-password'>
          Forgot password? <NavLink to='/reset-password'>Reset it!</NavLink>
    </div> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account,
});
const mapDispatchToProps = dispatch => ({
  login: (userLogin, password) => dispatch(login(userLogin, password)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
