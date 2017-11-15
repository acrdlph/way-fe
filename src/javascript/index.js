import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

ReactDOM.render((
  <div>
    <div className='col-md-3 col-sm-2'/>
    <div className='col-md-6 col-sm-8 col-xs-12'>
      <App/>
    </div>
    <div className='col-md-3 col-sm-2'/>
  </div>
), document.getElementById('root'));
