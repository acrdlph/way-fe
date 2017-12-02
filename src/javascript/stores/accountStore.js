import _ from 'lodash';

const types = {
  ACCOUNT_AVAILABILITY_CHECK_PENDING: 'ACCOUNT_AVAILABILITY_CHECK_PENDING',
  ACCOUNT_AVAILABILITY_CHECK_PASSED: 'ACCOUNT_AVAILABILITY_CHECK_PASSED',
  ACCOUNT_AVAILABILITY_CHECK_FAILED: 'ACCOUNT_AVAILABILITY_CHECK_FAILED',
  ACCOUNT_REGISTER_PENDING: 'ACCOUNT_REGISTER_PENDING',
  ACCOUNT_REGISTER_PASSED: 'ACCOUNT_REGISTER_PASSED',
  ACCOUNT_REGISTER_FAILED: 'ACCOUNT_REGISTER_FAILED',
  ACCOUNT_LOGIN_PENDING: 'ACCOUNT_LOGIN_PENDING',
  ACCOUNT_LOGIN_PASSED: 'ACCOUNT_LOGIN_PASSED',
  ACCOUNT_LOGIN_FAILED: 'ACCOUNT_LOGIN_FAILED'
};

export const registerAccount = (data) => (dispatch) => {
  dispatch({
    type: types.ACCOUNT_REGISTER_PENDING,
  });
  const endpoint = 'api/accounts';
  const body = JSON.stringify(data);
  fetch(endpoint, {
    method: 'post',
    body,
    headers: new Headers({
      'content-type': 'application/json'
    })
  })
  .then((res) => res.json())
  .then((data) => {
    dispatch({
      type: types.ACCOUNT_REGISTER_PASSED,
    });
  })
  .catch(error => {
    dispatch({
      type: types.ACCOUNT_REGISTER_FAILED
    });
  });
};

export const checkUsernameAvailability = (username) => (dispatch) => {
  dispatch({
    type: types.ACCOUNT_AVAILABILITY_CHECK_PENDING,
  });
  const endpoint = 'api/accounts/checkname/' + username;
  fetch(endpoint)
  .then((res) => res.json())
  .then((data) => {
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

export const login = (loginname, password) => (dispatch) => {
  dispatch({
    type: types.ACCOUNT_LOGIN_PENDING,
  });
  const endpoint = 'api/accounts/login';
  const body = JSON.stringify({
    loginname,
    password
  });
  fetch(endpoint, {
    method: 'post',
    body,
    headers: new Headers({
      'content-type': 'application/json'
    })
  })
  .then((res) => res.json())
  .then((data) => {
    dispatch({
      type: types.ACCOUNT_LOGIN_PASSED,
    });
  })
  .catch(error => {
    dispatch({
      type: types.ACCOUNT_LOGIN_FAILED
    });
  });
};


const initialState = {
  isCheckingAvailability: false,
  isAvailable: null,

  isRegisteringAccount: false,
  wasRegistrationSuccessful: null,

  isLoginPending: false,
  wasLoginSuccessful: null
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

    case types.ACCOUNT_REGISTER_PENDING:
      return {
        ...state,
        isRegisteringAccount: true,
        wasRegistrationSuccessful: null
      };
    case types.ACCOUNT_REGISTER_PASSED:
      return {
        ...state,
        isRegisteringAccount: false,
        wasRegistrationSuccessful: true
      };
    case types.ACCOUNT_REGISTER_FAILED:
      return {
        ...state,
        isRegisteringAccount: false,
        wasRegistrationSuccessful: false
      };

    case types.ACCOUNT_LOGIN_PENDING:
      return {
        ...state,
        isLoginPending: true,
        wasLoginSuccessful: null
      };
    case types.ACCOUNT_LOGIN_PASSED:
      return {
        ...state,
        isLoginPending: false,
        wasLoginSuccessful: true
      };
    case types.ACCOUNT_LOGIN_FAILED:
      return {
        ...state,
        isLoginPending: false,
        wasLoginSuccessful: false
      };

    default:
      return state;
  };
};

export default {
  reducer
};
