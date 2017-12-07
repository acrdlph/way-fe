import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import {PARTNER_LOCATIONS} from '../util/constants';
import './footer.less';

class Footer extends React.Component {
  render() {
    let airport = null;
    const {airportName} = this.props;
    if(airportName) {
      if(_.includes(PARTNER_LOCATIONS, airportName)) {
        airport = <img src={`assets/airport-logo-${airportName}.png`}/>;
      } else {
        airport = `Airport: ${airportName}`;
      }
    }

    if(airport) {
      return (
        <div className="footer">
          <div className='footer-airport-name'>
            {airport}
          </div>
        </div>
      );
    } else {
      return null;
    }

  }
}

const mapStateToProps = (state) => ({
  airportName: _.get(state.user, 'data.location')
});

export default connect(mapStateToProps)(Footer);
