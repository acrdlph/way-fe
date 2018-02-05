import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {trackPageView} from '../util/google-analytics';
import './interaction-confirmation.less';

class InteractionConfirmation extends React.Component {

  constructor(props) {
    super(props);

    if(this.props.location) {
      const path = this.props.location.pathname;
      trackPageView(path);
    }

    const interactionCode = _.get(this.props.match, 'params.interactionCode');
    const userId = sessionStorage.getItem('userId');
    console.log("interactionCode: ", interactionCode);
  }

  render() {
    return (
      <div className='interaction-confirmation'>
        Welcome to Waitlist!
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(InteractionConfirmation);
