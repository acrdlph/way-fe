import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {supportedLocations} from '../util/constants';
import './footer.less';

class Header extends React.Component {
  render() {
    let airport = '';
    const {airportName} = this.props;
    if(airportName) {
      if(_.includes(supportedLocations, airportName)) {
        airport = <img src={`assets/airport-logo-${airportName}.png`}/>;
      } else {
        airport = `Airport: ${airportName}`;
      }
    }

    return (
      <div className="footer">
        <div className='footer-airport-name'>
          {airport}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  airportName: _.get(state.user, 'data.location')
});

export default connect(mapStateToProps)(Header);
