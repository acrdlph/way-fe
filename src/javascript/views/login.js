import React from 'react';
import { connect } from 'react-redux';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
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
  }

  componentWillReceiveProps(props) {
    if (props.account.wasLoginSuccessful && !this.props.account.wasLoginSuccessful) {
      sessionStorage.setItem('userId', props.account.userId);
      trackEvent(events.USER_LOGGED_IN);
    }
  }

  changeLoginName(event, loginName) {
    this.setState({ loginName });
  }

  changePassword(event, password) {
    this.setState({ password });
  }

  login() {
    const { loginName, password } = this.state;
    this.props.login(loginName, password);
    const {
      showLocationRequired, showSearchBox, history, toggleDiv,
    } = this.props;
    saveAndContinue(showLocationRequired, showSearchBox, history, toggleDiv, calledFrom);
  }

  render() {
    return (
      <div className="login">
        <TextField
          id="username"
          className="username"
          floatingLabelText="Username or Email"
          onChange={this.changeLoginName}
          fullWidth
        />

        <TextField
          id="password"
          className="password"
          floatingLabelText="Password"
          type="Password"
          onChange={this.changePassword}
          fullWidth
        />

        <RaisedButton label="Log In" backgroundColor="white" onClick={this.login} fullWidth />

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
