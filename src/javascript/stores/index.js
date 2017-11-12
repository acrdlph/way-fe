import { combineReducers } from 'redux';
import waitlistStore from './waitlistStore';
import userStore from './userStore';

export default combineReducers({
  waitlist: waitlistStore.reducer,
  user: userStore.reducer
});
