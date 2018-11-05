import _ from 'lodash';
import { getAuthHeaders } from '../util/headers';

const types = {
  LOADING: 'CHAT_PARTNER_LOADING',
  LOADED: 'CHAT_PARTNER_LOADED',
  LOADLAST: 'LOAD_LAST_MESSAGE',
};

const awaitFetch = async function awaitFetch(chatPartnerId, created) {
  const endpoint = `api/users/${chatPartnerId}/details`;
  try {
    const result = await fetch(endpoint, {
      headers: getAuthHeaders(),
    });
    const data = await result.json();
    const partnerInfo = {
      id: data.id,
      photo: data.photo,
      name: data.name,
      interests: data.interests,
      username: data.username,
      created,
    };
    return partnerInfo;
  } catch (e) {
    console.log(e);
  }
};

export const loadChatPartnerData = () => (dispatch) => {
  const userId = sessionStorage.getItem('userId');
  const partners = [];
  dispatch({ type: types.LOADING });
  const endpoint = 'api/messages';
  fetch(endpoint, {
    headers: getAuthHeaders(),
  })
    .then(res => res.json())
    .then((res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].sender_id === userId) {
          partners.push(awaitFetch(res[i].receiver_id, res[i].created_at));
        } else {
          partners.push(awaitFetch(res[i].sender_id, res[i].created_at));
        }
      }
      Promise.all(partners).then(partn => dispatch({
        type: types.LOADED,
        data: _.orderBy(partn, 'created').reverse(),
      }));
    });
};

const initialState = {
  loading: false,
  loaded: false,
  data: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOADING:
      return {
        ...state,
        loading: true,
      };
    case types.LOADED:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.data,
      };
    default:
      return state;
  }
};

export default {
  reducer,
};
