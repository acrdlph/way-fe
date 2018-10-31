import _ from 'lodash';

const types = {
  LOADING: 'QUESTION_LOADING',
  LOADED: 'QUESTION_LOADED',
  QPOSTED: 'QUESTION_POSTED',
  RPOSTED: 'REPLY_POSTED',
  QDELETED: 'QUESTION_DELETED',
  RDELETED: 'REPLY_DELETED',
};

const awaitFetch = async function awaitFetch(dispatch) {
  const endpoint = 'api/question';
  try {
    const result = await fetch(endpoint);
    const resJson = await result.json();
    const questions = [];
    _.each(resJson, (entry) => {
      questions.push({
        _id: entry._id,
        asked_by: entry.asked_by,
        asked_at: entry.asked_at,
        upvotes: entry.upvotes,
        content: entry.content,
        replies: entry.replies,
        geolocation: entry.geolocation,
      });
    });
    dispatch({
      type: types.LOADED,
      data: questions,
    });
  } catch (e) {
    console.log(e);
  }
};

export const loadQuestions = () => (dispatch) => {
  dispatch({ type: types.LOADING });
  awaitFetch(dispatch);
};

export const postQuestion = data => async (dispatch) => {
  const endpoint = 'api/question/';
  const body = JSON.stringify(data);
  fetch(endpoint, {
    method: 'post',
    body,
    headers: new Headers({
      'content-type': 'application/json',
    }),
  })
    .then(res => res.json())
    .then(json => dispatch({ type: types.QPOSTED, data: json }));
};

export const postReply = data => (dispatch) => {
  const endpoint = `api/question/${data.qId}`;
  const body = JSON.stringify(data);
  fetch(endpoint, {
    method: 'PUT',
    body,
    headers: new Headers({
      'content-type': 'application/json',
    }),
  })
    .then(res => res.json())
    .then(json => dispatch({
      type: types.RPOSTED,
      data: json,
    }));
};

export const deleteQuestion = qId => (dispatch) => {
  const endpoint = `api/question/${qId}`;
  fetch(endpoint, {
    method: 'DELETE',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  }).then(() => dispatch({
    type: types.QDELETED,
    data: qId,
  }));
};

export const deleteReply = data => (dispatch) => {
  const endpoint = `api/question/${data.qId}/${data.rId}`;
  fetch(endpoint, {
    method: 'PUT',
    headers: new Headers({
      'content-type': 'application/json',
    }),
  })
    .then(res => res.json())
    .then(json => dispatch({
      type: types.RDELETED,
      data: json,
    }));
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
    case types.QPOSTED:
      return {
        ...state,
        data: state.data.concat(action.data),
      };
    case types.RPOSTED:
      return {
        ...state,
        data: [
          ...state.data.slice(0, state.data.findIndex(entry => entry._id === action.data[0]._id)),
          action.data[0],
          ...state.data.slice(state.data.findIndex(entry => entry._id === action.data[0]._id) + 1),
        ],
      };
    case types.QDELETED:
      return {
        ...state,
        data: state.data.filter(question => question._id !== action.data),
      };
    case types.RDELETED:
      console.log(action, 'an action');
      return {
        ...state,
        data: [
          ...state.data.slice(0, state.data.findIndex(entry => entry._id === action.data[0]._id)),
          action.data[0],
          ...state.data.slice(state.data.findIndex(entry => entry._id === action.data[0]._id) + 1),
        ],
      };

    default:
      return state;
  }
};

export default {
  reducer,
};
