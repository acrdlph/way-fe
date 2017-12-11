import React from 'react';
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {trackPageView} from '../util/google-analytics';
import {submitFeedback} from '../stores/feedbackStore.js';
import './feedback.less';

class Feedback extends React.Component {

  constructor(props) {
    super(props);
    const path = this.props.location.pathname;
    trackPageView(path);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const email = event.target.email.value;
    const feedback = event.target.feedback.value;
    this.props.submitFeedback(email, feedback);
  }

  render() {
    return (
      <div className='feedback'>
        Feel free to share your ideas how to improve WaitList!

        <form onSubmit={this.handleSubmit}>
          <div>
            <TextField
              name='email'
              hintText='Your email address (optional)'
              fullWidth={true}
            />
          </div>
          <div>
            <TextField
              name='feedback'
              hintText='Your feedback'
              multiLine={true}
              rowsMax={5}
              fullWidth={true}
            />
          </div>
          <div>
            <RaisedButton
              type='submit'
              backgroundColor='#ffd801'
              label='OK'
              fullWidth={true}
            />
          </div>
        </form>

      </div>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = dispatch => ({
  submitFeedback: (email, feedback) => dispatch(submitFeedback(email, feedback)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Feedback);
