import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import _ from 'lodash';
import TermsAndPolicy from '../components/terms-and-policy';
import { trackPageView } from '../util/google-analytics';
import CircularProgress from '../components/circularProgress';
import { PARTNER_LOCATIONS } from '../util/constants';
import { loadPartnerData } from '../stores/partnerStore';
import Footer from '../components/footer';
import Login from './login';
import { renderLocationInput, saveAndContinue } from '../util/location';
import './signup.less';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    const path = this.props.location.pathname;
    trackPageView(path);
    // TODO make this validation using partner api
    this.showSearchBox = this.showSearchBox.bind(this);
    this.showLocationRequired = this.showLocationRequired.bind(this);
    this.toggleDiv = this.toggleDiv.bind(this);
    this.goToSignup = this.goToSignup.bind(this);
    this.goToFeedback = this.goToFeedback.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
    const userId = sessionStorage.getItem('userId');
    const locationId = sessionStorage.getItem('locationId');
    if (userId && !props.user) {
      this.props.history.push(`/waitlist/${locationId}`); // user is onboarded already
    }
    this.state = {
      showLocationRequiredHint: false,
      isSearchBoxVisible: false,
    };
  }

  componentDidMount() {
    document.title = 'Sign up | CryptoGeeks';
  }

  showSearchBox() {
    this.setState({ isSearchBoxVisible: true });
  }

  showLocationRequired() {
    this.setState({ showLocationRequiredHint: true });
  }

  goToSignup() {
    this.props.history.push('/register');
  }

  goToFeedback() {
    this.props.history.push('/feedback');
  }

  resetPassword() {
    this.props.history.push('/reset-password');
  }

  toggleDiv() {
    const { show } = this.state;
    this.setState({ show: !show });
  }

  render() {
    return (
      <div className="signupContainer">
        <div>
          <div className="logoBox">
            <img src="assets/logoSignup.png" />
          </div>
          <div className="signupBox">
            <div className="textBox">
              <h3>Welcome to CryptoGeeks</h3>
              <p>
                A token-curated community of trusted blockchain experts & entrepreneurs from Berlin.
              </p>
            </div>
            <div className="loginBox">
              {renderLocationInput(
                this.state.isSearchBoxVisible,
                this.state.showLocationRequiredHint,
              )}
              {this.state.show && CircularProgress()}
              <Login
                pathname={this.props.location.pathname}
                onClick={saveAndContinue}
                locationId={this.locationId}
                showLocationRequired={this.showLocationRequired}
                showSearchBox={this.showSearchBox}
                history={this.props.history}
                toggleDiv={this.toggleDiv}
              />
            </div>
            <div className="newAccountBox">
              <p>
                Dont have an account?
                {' '}
                <a onClick={this.goToSignup}>
                  Get started now
                  {' '}
                  <i className="arrow" />
                </a>
              </p>
              {/* <p>
                <a onClick={this.resetPassword}>
                  I forgot my password
                  {' '}
                  <i className="arrow" />
                </a>
              </p> */}
            </div>
          </div>
          <div className="termsBox">
            <p>
              By continuing, you agree to our
              {' '}
              {
                <a
                  href="https://drive.google.com/file/d/1qmGuCI59X8EW-pDcvRhMDCZaa1D4_nGd/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service
                </a>
              }
              ,
              {' '}
              {
                <a
                  href="https://drive.google.com/file/d/1WjTFH8rs3GjA3DQlNOr6uvBCyUIhBNCS/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              }
              {' '}
              &
              {' '}
              <a
                href="https://drive.google.com/file/d/13TAmIv_EXfVHHkV9W3fY8AKr7hadcupf/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                Cookie use.
              </a>
            </p>
            <p>
              Powered by
              {' '}
              <a href="https://www.way.network/" target="_blank" rel="noopener noreferrer">
                Way Network
                {' '}
              </a>
              {/* · Legal Notice */}
              {' '}
·
              <a onClick={this.goToFeedback} className="feedback-handler">
                {' '}
                Feedback
                {' '}
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  partners: state.partners,
  user: state.user,
  account: state.account,
});
const mapDispatchToProps = dispatch => ({
  loadPartnerData: () => dispatch(loadPartnerData()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Signup);
