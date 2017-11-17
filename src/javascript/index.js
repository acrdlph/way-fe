import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './index.less';

ReactDOM.render((
  <div className='row'>
    <div className='col-xs-12 col-md-8'>
      <App/>
    </div>
  </div>
), document.getElementById('root'));
