import _ from 'lodash';

const types = {
  EDITING: 'USER_EDIT',
  LOADING: 'USER_LOADING',
  LOADED: 'USER_LOADED',
  UPDATED: 'USER_UPDATED'
};

export const isOnboarded = (user) => {
  const name = _.get(user, 'data.name', '');
  const interests = _.get(user, 'data.interests', '');
  return name.trim() !== '' && interests.trim() !== '';
};

export const editUserData = () => {
  return {
    type: types.EDITING
  };
};

export const loadUserData = (userId) => (dispatch) => {
  dispatch({type: types.LOADING});

  const endpoint = 'api/users/' + userId + '/details';
  fetch(endpoint)
  .then((res) => res.json())
  .then((data) => {
    const user = {
      id: userId,
      location: data.location.toLowerCase(),
      waitingTime: data.waiting_time,
      photo:  data.photo,
      name: data.name,
      interests: data.interests
    };
    dispatch({
      type: types.LOADED,
      data: user
    });
  });
};

export const updateUserData = (userId, data) => (dispatch) => {
  const endpoint = 'api/users/'+userId;
  const body = JSON.stringify(data);
  fetch(endpoint, {
    method: 'put',
    body,
    headers: new Headers({
      'content-type': 'application/json'
    })
  })
  .then((res) => res.json())
  .then((json) => {
    dispatch({
      type: types.UPDATED
    });
    dispatch(loadUserData(userId));
  });
};


const initialState = {
  loading: false,
  loaded: false,
  isEditable: false,
  data: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOADING:
      return {
        ...state,
        loading: true
      };
      case types.LOADED:
        return {
          ...state,
          loading: false,
          loaded: true,
          data: action.data
        };
      case types.EDITING:
        return {
          ...state,
          isEditable: true
        };
      case types.UPDATED:
        return {
          ...state,
          isEditable: false
        };
    default:
      return state;
  };
};

export default {
  reducer
};
