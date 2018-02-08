import _ from 'lodash';
import {getAuthHeaders} from './headers';
import {handle401} from './check-auth';

export default ({name, route}) => {

  const actionPrefix = name.toUpperCase();
  const types = {
    PENDING: `${actionPrefix}_PENDING`,
    SUCCESSFUL: `${actionPrefix}_SUCCESSFUL`,
    FAILED: `${actionPrefix}_FAILED`,
  };

  const send = (payload) => (dispatch) => {
    const url = _.isFunction(route) ? route(payload) : route;
    dispatch({
      type: types.PENDING
    });
    const headers = {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    };
    fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })
    .then((res) => handle401(res, dispatch))
    .then((res) => res.json())
    .then((json) => {
      dispatch({
        type: types.SUCCESSFUL,
        data: json
      });
    })
    .catch(error => {
      dispatch({
        type: types.FAILED
      });
    });
  };

  const initialState = {
    loading: false,
    loaded: false,
    failed: false,
    data: null
  };

  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case types.PENDING:
        return {
          ...state,
          loading: true,
          loaded: false,
          failed: false
        };
      case types.SUCCESSFUL:
        return {
          loading: false,
          loaded: true,
          failed: false,
          data: action.data
        };
      case types.FAILED:
        return {
          loading: false,
          loaded: false,
          failed: true,
          data: null
        };
      default:
        return state;
    };
  };

  return {
    name,
    types,
    reducer,
    actions: {
      send
    }
  };

};
