import React from 'react';
import {connect} from 'react-redux';
import QRCode from 'qrcode';
import {trackPageView} from '../util/google-analytics';
import {loadChallengeUrl} from '../stores/challengeStore';
import './challenge.less';

class Challenge extends React.Component {

  constructor(props) {
    super(props);

    const path = this.props.location.pathname;
    trackPageView(path);

    props.loadChallengeUrl();
  }

  componentWillReceiveProps(props) {
    if(props.url && !this.props.url) {
      QRCode.toCanvas(canvas, url, function (error) {
        if (error) console.error(error);
        console.log('success!');
      });
    }
  }

  render() {
    const canvas = document.getElementById('canvas');
    return (
      <div className='challenge container'>
        Challenge
        <canvas id='canvas'/>
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  url: state.challenge.url
});
const mapDispatchToProps = dispatch => ({
  loadChallengeUrl: () => dispatch(loadChallengeUrl)
});

export default connect(mapStateToProps, mapDispatchToProps)(Challenge);
