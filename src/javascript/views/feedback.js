import React from 'react';
import { connect } from 'react-redux';
import { TextField, Button } from '@material-ui/core';
import RefreshIndicator from '../components/circularProgress';
import { trackPageView } from '../util/google-analytics';
import { submitFeedback } from '../stores/feedbackStore';
import './feedback.less';

class Feedback extends React.Component {
  constructor(props) {
    super(props);
    const path = this.props.location.pathname;
    trackPageView(path);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goToHomepage = this.goToHomepage.bind(this);
  }

  componentDidMount() {
    document.title = 'Feedback | CryptoGeeks';
  }

  handleSubmit(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const feedback = event.target.feedback.value;
    this.props.submitFeedback(email, feedback);
  }

  goToHomepage() {
    this.props.history.push('/');
  }

  renderSuccessInfo() {
    return (
      <div>
        Thank you for your support!
        <div>
          <Button onClick={this.goToHomepage} backgroundColor="#68a0ce" label="OK" />
        </div>
      </div>
    );
  }

  renderForm() {
    const { isSuccessful, error } = this.props.feedback;

    if (isSuccessful) {
      return this.renderSuccessInfo();
    }

    const errorMessage = error ? 'There was an error, please try again!' : null;

    return (
      <form onSubmit={this.handleSubmit}>
        Feel free to share your ideas how to improve Blockgeeks!
        <div>
          <TextField name="email" helperText="Your email address (optional)" fullWidth />
        </div>
        <div>
          <TextField name="feedback" helperText="Your feedback" multiline rowsMax={5} fullWidth />
        </div>
        <div>
          <Button type="submit" color="primary" fullWidth>
            OK
          </Button>
        </div>
        {errorMessage}
      </form>
    );
  }

  renderLoadingSpinner() {
    return (
      <div>
        <RefreshIndicator
          size={40}
          left={0}
          top={20}
          status="loading"
          style={{
            display: 'inline-block',
            position: 'relative',
          }}
        />
      </div>
    );
  }

  render() {
    const { isPending } = this.props.feedback;
    const content = isPending ? this.renderLoadingSpinner() : this.renderForm();

    return (
      <div className="feedback">
        <div className="feedback-content">{content}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  feedback: state.feedback,
});

const mapDispatchToProps = dispatch => ({
  submitFeedback: (email, feedback) => dispatch(submitFeedback(email, feedback)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Feedback);
