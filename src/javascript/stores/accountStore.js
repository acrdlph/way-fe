import _ from 'lodash';

const types = {
  ACCOUNT_AVAILABILITY_CHECK_PENDING: 'ACCOUNT_AVAILABILITY_CHECK_PENDING',
  ACCOUNT_AVAILABILITY_CHECK_PASSED: 'ACCOUNT_AVAILABILITY_CHECK_PASSED',
  ACCOUNT_AVAILABILITY_CHECK_FAILED: 'ACCOUNT_AVAILABILITY_CHECK_FAILED'
};

export const checkUsernameAvailability = (username) => (dispatch) => {
  const endpoint = 'api/accounts/checkname/' + username;
  fetch(endpoint)
  .then((res) => res.json())
  .then((data) => {
    const photo = data.photo;
    dispatch({
      type: types.ACCOUNT_AVAILABILITY_CHECK_PASSED,
    });
  })
  .catch(error => {
    dispatch({
      type: types.ACCOUNT_AVAILABILITY_CHECK_FAILED
    });
  });
};

const initialState = {
  isCheckingAvailability: false,
  isAvailable: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ACCOUNT_AVAILABILITY_CHECK_PENDING:
      return {
        ...state,
        isCheckingAvailability: true,
        isAvailable: null
      };
    case types.ACCOUNT_AVAILABILITY_CHECK_PASSED:
      return {
        ...state,
        isCheckingAvailability: false,
        isAvailable: true
      };
    case types.ACCOUNT_AVAILABILITY_CHECK_FAILED:
      return {
        ...state,
        isCheckingAvailability: false,
        isAvailable: false
      };
    default:
      return state;
  };
};

export default {
  reducer
};
