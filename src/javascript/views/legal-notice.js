import React from 'react';
import { trackPageView } from '../util/google-analytics';
import './legal-notice.less';

export default class LegalNotice extends React.Component {
  constructor(props) {
    super(props);
    const path = this.props.location.pathname;
    trackPageView(path);
  }

  componentDidMount() {
    document.title = 'Legal Notice | CryptoGeeks';
  }

  render() {
    return (
      <div className="legal-notice">
        <div className="legal-notice-content">
          <h2>Legal Notice</h2>
          <h3>Contact</h3>
          Way Network UG i.G.
          <br />
          Ackerstraße 76
          <br />
          13355 Berlin
          <br />
          Germany
        </div>
      </div>
    );
  }
}
