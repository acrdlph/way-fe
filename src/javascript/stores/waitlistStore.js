import _ from 'lodash';
import {notify} from '../util/notification';

const types = {
  LOADING: 'WAITLIST_LOADING',
  LOADED: 'WAITLIST_LOADED'
};

let refresher = false;
let alreadyLoadedData = [];

export const loadWaitlist = (userId) => (dispatch) => {
  // this might not be optimal
  // updating individual waitlist items and reordering seems the best solution
  fetcher(dispatch, userId);
  if (!refresher) {
    refresher = setInterval(() => {backgroundFetcher(dispatch, userId);}, 5000);
  }
};

const initialState = {
  loading: false,
  loaded: false,
  data: []
};

const fetcher = (dispatch, userId) => {
  dispatch({type: types.LOADING});
  const endpoint = 'api/users/' + userId;
  fetch(endpoint)
  .then((res) => res.json())
  .then((data) => {
    const onTheListSorted = mapWaitListData(data);
    alreadyLoadedData = onTheListSorted;
    dispatch({
      type: types.LOADED,
      data: onTheListSorted
    });
  });
};

const backgroundFetcher = (dispatch, userId) => {
  const endpoint = 'api/users/' + userId;
  fetch(endpoint)
  .then((res) => res.json())
  .then((data) => {
    const onTheListSorted = mapWaitListData(data);
    if (isDifferent(onTheListSorted, alreadyLoadedData)) {
      dispatch({type: types.LOADING});
      alreadyLoadedData = onTheListSorted;
      notify('A new user has joined the WaitList!');
    }
    dispatch({
      type: types.LOADED,
      data: onTheListSorted
    });
  });
};

const isDifferent = (data1, data2) => {
  const diffs = data1.map((element, index) => {
    return _.isMatch(element, data2[index]) ? "yes" : "no";
  });
  return _.includes(diffs, "no");
};

const mapWaitListData = (data) => {
  const onTheList = [];
  _.each(data, entry => {
    onTheList.push({
      id: entry.id,
      name: entry.name || '',
      interests: entry.interests || '',
      timeLeft: entry.time_left,
      hasChat: entry.count > 0,
      nonDeliveredChatCount: entry.non_delivered_count,
      lastContact: entry.last_contact ? new Date(entry.last_contact).getTime() : 0
    });
  });
  return _.reverse(_.sortBy(_.reverse(_.sortBy(onTheList, 'timeLeft')), 'lastContact'));
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
