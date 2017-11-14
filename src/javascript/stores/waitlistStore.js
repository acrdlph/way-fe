import _ from 'lodash';

const types = {
  LOADING: 'WAITLIST_LOADING',
  LOADED: 'WAITLIST_LOADED'
};

export const loadWaitlist = (userId) => (dispatch) => {
  dispatch({type: types.LOADING});

  const endpoint = 'api/users/' + userId;
  fetch(endpoint)
  .then((res) => res.json())
  .then((data) => {
    const onTheList = [];
    _.each(data, entry => {
      onTheList.push({
        id: entry.id,
        name: entry.name || '',
        interests: entry.interests || '',
        timeLeft: entry.time_left,
        hasChat: entry.count > 0
      });
    });
    const onTheListSorted = _.reverse(_.sortBy(onTheList, 'timeLeft'));
    dispatch({
      type: types.LOADED,
      data: onTheListSorted
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
