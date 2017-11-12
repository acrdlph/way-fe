import { combineReducers } from 'redux';
import waitlistStore from './waitlistStore';
import userStore from './userStore';
import chatStore from './chatStore';

export default combineReducers({
  waitlist: waitlistStore.reducer,
  user: userStore.reducer,
  chat: chatStore.reducer
});
