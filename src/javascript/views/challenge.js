import React from 'react';
import {connect} from 'react-redux';
import QRCode from 'qrcode';
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
  user: state.user,
  url: state.user.data.interactionUrl
});
const mapDispatchToProps = dispatch => ({
  loadUserDataForChallenge: (id) => dispatch(loadUserDataWithBonusUrl(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Challenge);
