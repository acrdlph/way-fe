import { combineReducers } from 'redux';
import waitlistStore from './waitlistStore';
import userStore from './userStore';
import chatPartnerStore from './chatPartnerStore';
import chatStore from './chatStore';
import partnerStore from './partnerStore';
import profileImageStore from './profileImageStore';
import accountStore from './accountStore';
import feedbackStore from './feedbackStore';
import interactionConfirmationStore from './interactionConfirmationStore';
import modalStore from './modalStore';
import qnaStore from './qnaStore';

export default combineReducers({
  waitlist: waitlistStore.reducer,
  user: userStore.reducer,
  chatPartner: chatPartnerStore.reducer,
  chat: chatStore.reducer,
  partners: partnerStore.reducer,
  profileImage: profileImageStore.reducer,
  account: accountStore.reducer,
  feedback: feedbackStore.reducer,
  confirmInteraction: interactionConfirmationStore.reducer,
  modalStore: modalStore.reducer,
  questions: qnaStore.reducer,
});
