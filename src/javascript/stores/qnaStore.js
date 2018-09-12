import _ from 'lodash';

const types = {
  LOADING: 'QUESTION_LOADING',
  LOADED: 'QUESTION_LOADED',
  QPOSTED: 'QUESTION_POSTED',
};

const awaitFetch = async function awaitFetch(dispatch) {
  const endpoint = 'api/question';
  try {
    const result = await fetch(endpoint);
    const resJson = await result.json();
    const questions = [];
    _.each(resJson, (entry) => {
      questions.push({
        id: entry._id,
        asker_id: entry.asker_id,
        asked_at: entry.asked_at,
        upvotes: entry.upvotes,
        content: entry.content,
        replies: entry.replies,
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

export const postQuestion = data => (dispatch) => {
  console.log('is stuff happening?');
  const endpoint = 'api/question/';
  const body = JSON.stringify(data);
  console.log(data, 'yaawwwwwsswwss');
  fetch(endpoint, {
    method: 'post',
    body,
    headers: new Headers({
      'content-type': 'application/json',
    }),
  })
    .then(res => res.json())
    .then((json) => {
      dispatch({
        type: types.QPOSTED,
      });
      dispatch(loadQuestions);
    });
};

postQuestion();
console.log('stuff is happening');

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
        loading: false,
        loaded: true,
        data: action.data,
      };
    default:
      return state;
  }
};

export default {
  reducer,
};
