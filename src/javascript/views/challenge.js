import React from 'react';
import {connect} from 'react-redux';
import QRCode from 'qrcode';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {trackPageView} from '../util/google-analytics';
import {loadChallengeUrl} from '../stores/challengeStore';
import {loadUserDataWithBonusUrl} from '../stores/userStore';
import './challenge.less';

class Challenge extends React.Component {

  constructor(props) {
    super(props);

    const path = this.props.location.pathname;
    trackPageView(path);

    const userId = sessionStorage.getItem('userId');
    props.loadUserDataForChallenge(userId);
  }

  componentDidMount() {
    console.log("componentDidMount...");
    const url = this.props.url;
    console.log("url", url);
    if(url) {
      QRCode.toCanvas(canvas, "http://"+url, function (error) {
        if (error) console.error(error);
        console.log('success!');
      });
    }
  }

  componentWillReceiveProps(props) {
    console.log("props", props);
    if(props.url && !this.props.url) {
      const url = props.url;
      console.log("url", url);
      if(url) {
        QRCode.toCanvas(canvas, "http://"+url, function (error) {
          if (error) console.error(error);
          console.log('success!');
        });
      }
    }
  }

  render() {
    let url = this.props.url;
    let challengeUrl = null;
    let loadingSpinner = null;

    if(url) {
      url = 'http://'+url;
      challengeUrl = (
        <div className='challenge-url'>
          <a href={url}>{url}</a>
        </div>
      );
    } else {
      loadingSpinner = (
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


    const canvas = document.getElementById('canvas');
    return (
      <div className='challenge container'>
        <div className='challenge-header'>
          Start an interaction with a stranger!
        </div>

        <div className='challenge-wayt-symbol'>
          <img src='/assets/wayt-symbol.png' />
        </div>

        <div className='challenge-message'>
          Receive your reward by getting the stranger to scan the QR code or opening the link
        </div>

        {loadingSpinner}
        <canvas id='canvas'/>
        {challengeUrl}
      </div>
    );
  }

}

const mapStateToProps = (state) => ({
  user: state.user,
  url: state.user.data.interactionUrl
});
const mapDispatchToProps = dispatch => ({
  loadUserDataForChallenge: (id) => dispatch(loadUserDataWithBonusUrl(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Challenge);
