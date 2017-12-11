import React from 'react';
import { NavLink } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {trackPageView} from '../util/google-analytics';
import './feedback.less';

export default class Feedback extends React.Component {

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
    // TODO: send feedback
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
