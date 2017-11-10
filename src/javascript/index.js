import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Onboarding from './views/onboarding';
import Signup from './views/signup';

ReactDOM.render(<MuiThemeProvider><Signup/></MuiThemeProvider>, document.getElementById('root'));
