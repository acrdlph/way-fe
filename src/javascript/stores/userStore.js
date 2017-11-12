import _ from 'lodash';

const types = {
  LOADING: 'USER_LOADING',
  LOADED: 'USER_LOADED'
};

export const loadUserData = (userId) => (dispatch) => {
  dispatch({type: types.LOADING});

  const endpoint = 'api/users/' + userId + '/details';
  fetch(endpoint)
  .then((res) => res.json())
  .then((data) => {
    const user = {
      location: data.location,
      waitingTime: data.waiting_time,
      name: data.name,
      interests: data.interests
    };
    dispatch({
      type: types.LOADED,
      data: user
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
