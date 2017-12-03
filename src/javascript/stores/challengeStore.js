import _ from 'lodash';

export const loadChallengeUrl = () => {
  // load url from backend here
};

const types = {
  LOADING: 'CHALLENGE_LOADING',
  LOADED: 'CHALLENGE_LOADED'
};

const initialState = {
  loading: false,
  loaded: false,
  url: null
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
