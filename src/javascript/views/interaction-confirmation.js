import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {trackPageView} from '../util/google-analytics';
import interactionConfirmationStore from '../stores/interactionConfirmationStore';
import './interaction-confirmation.less';

class InteractionConfirmation extends React.Component {

  constructor(props) {
    super(props);

    if(this.props.location) {
      const path = this.props.location.pathname;
      trackPageView(path);
    }

    const userId = sessionStorage.getItem('userId');
    this.confirm = this.confirm.bind(this);
  }

  confirm() {
    const interactionCode = _.get(this.props.match, 'params.interactionCode');
    this.props.confirmInteraction(interactionCode);
  }

  render() {
    return (
      <div className='interaction-confirmation'>
        Welcome to Waitlist!
        <br/>
        <button onClick={this.confirm}>Confirm</button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = dispatch => ({
  confirmInteraction: (code) => dispatch(
    interactionConfirmationStore.actions.send({
      url: `api/interactions/username/${code}`,
      payload: ''
    })
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(InteractionConfirmation);
