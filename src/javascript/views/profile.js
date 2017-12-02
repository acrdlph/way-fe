import React from 'react';
import { NavLink } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {trackPageView} from '../util/google-analytics';
import TermsAndPolicy from '../components/terms-and-policy';
import InfoBox from '../components/infobox';
import './profile.less';

export default class Profile extends React.Component {

  constructor(props) {
    super(props);
    const path = this.props.location.pathname;
    trackPageView(path);
  }

  render() {
    const username = _.get(this.props.match, 'params.username');
    return (
      <div className='profile container'>
        This is the profile of {username}!
      </div>
    );
  }
}
