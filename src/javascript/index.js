import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './index.less';

ReactDOM.render((
  <div className='full-height'>
    <div className='col-md-3 col-sm-2'/>
    <div className='full-height main col-md-6 col-sm-8 col-xs-12'>
      <App/>
    </div>
    <div className='col-md-3 col-sm-2'/>
  </div>
), document.getElementById('root'));
