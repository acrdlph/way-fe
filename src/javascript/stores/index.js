import { combineReducers } from 'redux';
import waitlistStore from './waitlistStore';

export default combineReducers({
  waitlist: waitlistStore.reducer
});
