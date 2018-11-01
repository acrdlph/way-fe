import React from 'react';
import _ from 'lodash';
import Push from 'push.js';
import { getAuthHeaders } from '../util/headers';
import { notify, types as notificationTypes } from '../util/notification';
import Onboarding, { register } from '../views/registration.js';
import UserData from '../components/user-data';
import { loadChatPartnerData } from './chatPartnerStore';

const types = {
  LOADING: 'CHAT_LOADING',
  LOADED: 'CHAT_LOADED',
  ADDMESSAGE: 'CHAT_ADD_MESSAGE',
  SENT: 'NOTIFICATION_SENT',
};
const getUsername = (userId) => {
  // TODO: This is highly inefficient and has to be refactored!
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const x = this.props.loadUserData(userId);
  return username[userId];
};
// pop-up notification function for chat service
export const notifyNewMessage = (message, senderName) => {
  const currentPath = window.location.hash;
  const receiverId = message.receiver_id;
  const senderId = message.sender;
  const userId = sessionStorage.getItem('userId');

  if (userId !== senderId) {
    Push.create(`${senderName} messaged you`, {
      body: message.message,
      icon:
        'https://static.wixstatic.com/media/b0fd8d_f9da5291c3034064ad161d6fe3d166d3~mv2_d_3000_3000_s_4_2.png/v1/crop/x_0,y_0,w_3000,h_1714/fill/w_92,h_44,al_c,usm_0.66_1.00_0.01/b0fd8d_f9da5291c3034064ad161d6fe3d166d3~mv2_d_3000_3000_s_4_2.png',
      timeout: 4000,
      onClick() {
        window.focus();
        this.close();
      },
    });
    // notify(`New message from ${senderName}`, notificationTypes.NEW_MESSAGE_RECEIVED, message.message);
  }
};

export const TransformMessages = (messages) => {
  const transformedMessages = [];
  _.each(messages, (entry) => {
    transformedMessages.push({
      id: entry.id,
      local_id: entry.local_id,
      sender: entry.sender_id,
      receiver: entry.receiver_id,
      message: entry.message,
      delivered: entry.delivered,
      createdAt: entry.created_at,
    });
    if (entry.delivered === false) {
      const notifier = 'You have a new message';
      return <p>{notifier}</p>;
    }
  });
  return transformedMessages;
};
const sortMessages = (messages) => {
  const distinctMessages = _(messages)
    .orderBy('createdAt', 'desc')
    .uniqBy('local_id') // uniqBy will remove duplicates(locally added messages when offline) by keeping only the first occurrence
    .reverse() // reverse again to make it createdAt asc
    .value();
  return distinctMessages;
};
export const loadMessages = (userId, chatPartnerId) => (dispatch) => {
  dispatch({ type: types.LOADING });
  const endpoint = `api/messages/receive?buddy_id=${chatPartnerId}`;
  fetch(endpoint, {
    method: 'post',
    headers: getAuthHeaders(),
  })
    .then(res => res.json())
    .then((data) => {
      const messages = TransformMessages(data);
      dispatch({
        type: types.LOADED,
        data: messages,
      });
    });
};
export const addMessagesToChat = (messages, chatPartnerId) => {
  const transformedMessages = TransformMessages(messages);
  _.each(transformedMessages, (message) => {});
  const messagesFromOpenChatOnly = _.filter(
    transformedMessages,
    msg => msg.sender === chatPartnerId || msg.receiver === chatPartnerId,
  );
  return {
    type: types.ADDMESSAGE,
    data: messagesFromOpenChatOnly,
  };
};
export const notificationSent = () => ({
  type: types.SENT,
});
const initialState = {
  loading: false,
  loaded: false,
  data: [],
  showNotification: false,
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOADING:
      return {
        loading: true,
        loaded: false,
        data: [],
      };
    case types.LOADED:
      return {
        loading: false,
        loaded: true,
        data: sortMessages(action.data),
      };
    case types.ADDMESSAGE:
      const newMessages = action.data;
      const allMessages = sortMessages(newMessages.concat(state.data));
      return {
        ...state,
        data: allMessages,
        showNotification: true,
      };
    case types.SENT:
      return {
        ...state,
        showNotification: false,
      };
    default:
      return state;
  }
};

export default {
  reducer,
};
