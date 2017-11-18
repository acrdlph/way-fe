import _ from 'lodash';
import {notify} from '../util/notification';

const types = {
  LOADING: 'WAITLIST_LOADING',
  LOADED: 'WAITLIST_LOADED'
};

let refresher = false;
let alreadyLoadedData = [];

const onUserJoined = (user) => {
  console.log("new user joined: " + JSON.stringify(user));
  notify(`${user.name} has joined the WaitList!`);
};

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
    const existingUserIds = alreadyLoadedData.map((user) => user.id);
    const currentUserIds = onTheListSorted.map((user) => user.id);
    if (isDifferent(existingUserIds, currentUserIds)) {
      dispatch({type: types.LOADING});
      alreadyLoadedData = onTheListSorted;
      const newUserIds = extractNewUsers(existingUserIds, currentUserIds);
      _.each(newUserIds, (id) => {
        const newUser = _.find(onTheListSorted, (user) => user.id === id);
        onUserJoined(newUser);
      });
    }

    dispatch({
      type: types.LOADED,
      data: onTheListSorted
    });
  });
};

const isDifferent = (existingUserIds, currentUserIds) => {
  const union = _.intersection(existingUserIds, currentUserIds);
  return !(existingUserIds.length === currentUserIds.length && existingUserIds.length === union.length);
};

const extractNewUsers = (existingUserIds, currentUserIds) => {
  const newUsers = [];
  _.each(currentUserIds, id => {
    if(!_.includes(existingUserIds, id)) {
      newUsers.push(id);
    }
  });
  return newUsers;
};

const isOnboarded = (user) => {
  const name = user.name || '';
  const interests = user.interests || '';
  return name.trim() !== '' && interests.trim() !== '';
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
  const onboardedOnly = _.filter(onTheList, (user) => isOnboarded(user));
  return _.reverse(_.sortBy(_.reverse(_.sortBy(onboardedOnly, 'timeLeft')), 'lastContact'));
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
