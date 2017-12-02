import React from 'react';
import {connect} from 'react-redux';
import {trackPageView} from '../util/google-analytics';
import './challenge.less';

class Challenge extends React.Component {

  render() {
    return (
      <div className='challenge container'>
        Challenge
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
});
const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Challenge);
