import { combineReducers } from 'redux';
import waitlistStore from './waitlistStore';
import userStore from './userStore';
import chatStore from './chatStore';
import userDirectoryStore from './userDirectoryStore';
import partnerStore from './partnerStore';
import profileImageStore from './profileImageStore';
import accountStore from './accountStore';
import feedbackStore from './feedbackStore';

export default combineReducers({
  waitlist: waitlistStore.reducer,
  user: userStore.reducer,
  chat: chatStore.reducer,
  userDirectory: userDirectoryStore.reducer,
  partners: partnerStore.reducer,
  profileImage: profileImageStore.reducer,
  account: accountStore.reducer,
  feedback: feedbackStore.reducer
});
