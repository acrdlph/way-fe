import _ from 'lodash';

const types = {
  LOADING: 'CHAT_LOADING',
  LOADED: 'CHAT_LOADED'
};

export const loadMessages = (userId, chatPartnerId) => (dispatch) => {
  dispatch({type: types.LOADING});

  const endpoint = `api/messages?sender_id=${userId}&receiver_id=${chatPartnerId}`;
  console.log("load chat: " + endpoint);

  fetch(endpoint)
  .then((res) => res.json())
  .then((data) => {
    console.log("receive chat messages: " + JSON.stringify(data));
    dispatch({
      type: types.LOADED,
      data: []
    });
  });
};


const initialState = {
  loading: false,
  loaded: false,
  data: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOADING:
      return {
        loading: true,
        loaded: false,
        data: []
      };
      case types.LOADED:
        return {
          loading: false,
          loaded: true,
          data: action.data
        };
    default:
      return state;
  };
};

export default {
  reducer
};
