import _ from 'lodash';

const types = {
  PENDING: 'FEEDBACK_SUBMIT_PENDING',
  SUCCESSFUL: 'FEEDBACK_SUBMIT_SUCCESSFUL',
  ERROR: 'FEEDBACK_SUBMIT_ERROR'
};

export const submitFeedback = (email, feedback) => (dispatch) => {
  dispatch({type: types.PENDING});
  const endpoint = 'api/feedback';
  const body = JSON.stringify({email, feedback});
  fetch(endpoint, {
    method: 'post',
    body,
    headers: new Headers({
      'content-type': 'application/json'
    })
  })
  .then((res) => {
    dispatch({type: types.SUCCESSFUL});
  })
  .catch((error) => {
    dispatch({type: types.ERROR});
  });
};

const initialState = {
  pending: false,
  successful: null,
  error: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOADING:
      return {
        pending: true,
        successful: null,
        error: null
      };
    case types.SUCCESSFUL:
      return {
        pending: false,
        successful: true,
        error: false
      };
    case types.ERROR:
      return {
        pending: false,
        successful: false,
        error: true
      };
    default:
      return state;
  };
};

export default {
  reducer
};
