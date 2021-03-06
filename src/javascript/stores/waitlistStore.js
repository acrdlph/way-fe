import _ from 'lodash';
import { getAuthHeaders } from '../util/headers';
import { handle401 } from '../util/check-auth';
import { notify, types as notificationTypes } from '../util/notification';

const types = {
  LOADING: 'WAITLIST_LOADING',
  LOADED: 'WAITLIST_LOADED',
};

// let refresher = false;
let alreadyLoadedData = [];

const onUserJoined = (user) => {
  const name = user.name || 'An anonymous bird';
  notify(`${name} has joined the Cryptogeeks!`, notificationTypes.USER_JOINED_WAITLIST);
};

const initialState = {
  loading: false,
  loaded: false,
  data: [],
};

const mapWaitListData = (data) => {
  const onTheList = [];
  _.each(data, (entry) => {
    onTheList.push({
      id: entry.id,
      name: entry.name || entry.default_name || '',
      interests: entry.interests || '',
      photo: entry.photo,
      address: entry.address,
      balance: entry.address,
      endorsement: entry.endorsement,
      hangoutPlaces: entry.hangoutPlaces,
      hasChat: entry.count > 0,
      nonDeliveredChatCount: entry.non_delivered_count,
      lastContact: entry.last_contact ? new Date(entry.last_contact).getTime() : 0,
    });
  });
  // TODO: activate this filter as soon as we have more users
  // const onboardedOnly = _.filter(onTheList, (user) => isOnboarded(user));
  const onboardedOnlyWithHash = onTheList.map(user => ({
    ...user,
    hash: createHash(user),
  }));
  return onTheList;
};

const fetcher = (dispatch, userId) => {
  dispatch({ type: types.LOADING });
  const distance = sessionStorage.getItem('distance') || 5000;
  const endpoint = `api/users/${userId}?distance=${distance}`;
  fetch(endpoint, {
    headers: getAuthHeaders(),
  })
    .then(res => handle401(res, dispatch))
    .then(res => res.json())
    .then((data) => {
      const onTheListSorted = mapWaitListData(data).sort((a, b) => b.endorsement - a.endorsement);
      alreadyLoadedData = onTheListSorted;
      dispatch({
        type: types.LOADED,
        data: onTheListSorted,
      });
    });
};
export const loadWaitlist = userId => (dispatch) => {
  // this might not be optimal
  // updating individual waitlist items and reordering seems the best solution
  fetcher(dispatch, userId);
  // if (!refresher) {
  //   refresher = setInterval(() => { backgroundFetcher(dispatch, userId); }, 5000);
  // }
};

const createHash = (user) => {
  const { id, nonDeliveredChatCount } = user;
  const hash = `${id}-${nonDeliveredChatCount}`;
  return hash;
};

// const backgroundFetcher = (dispatch, userId) => {
//   const distance = sessionStorage.getItem('distance') || 5000;
//   const endpoint = 'api/users/' + userId + "?distance=" + distance;
//   fetch(endpoint, {
//     headers: getAuthHeaders()
//   })
//     .then((res) => handle401(res, dispatch))
//     .then((res) => res.json())
//     .then((data) => {
//       const onTheListSorted = mapWaitListData(data).sort((a, b ) => b.endorsement - a.endorsement);
//       const existingUserHashes = alreadyLoadedData.map((user) => user.hash);
//       const currentUserHashes = onTheListSorted.map((user) => user.hash);
//       const existingUserIds = alreadyLoadedData.map((user) => user.id);
//       const currentUserIds = onTheListSorted.map((user) => user.id);

//       if (isDifferent(existingUserHashes, currentUserHashes)) {
//         dispatch({ type: types.LOADING });
//         alreadyLoadedData = onTheListSorted;
//         const newUserIds = extractNewUsers(existingUserIds, currentUserIds);
//         _.each(newUserIds, (id) => {
//           const newUser = _.find(onTheListSorted, (user) => user.id === id);
//           onUserJoined(newUser);
//         });
//       }

//       dispatch({
//         type: types.LOADED,
//         data: onTheListSorted
//       });
//     });
// };

const isDifferent = (existingUserHashes, currentUserHashes) => {
  const union = _.intersection(existingUserHashes, currentUserHashes);
  return !(
    existingUserHashes.length === currentUserHashes.length
    && existingUserHashes.length === union.length
  );
};

const extractNewUsers = (existingUserIds, currentUserIds) => {
  const newUsers = [];
  _.each(currentUserIds, (id) => {
    if (!_.includes(existingUserIds, id)) {
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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.LOADING:
      return {
        loading: true,
        loaded: false,
        data: [],
      };
    case types.LOADED:
      console.log(sessionStorage.getItem('scrollPosition'));
      sessionStorage.getItem('scrollPosition')
        && window.scrollTo(0, sessionStorage.getItem('scrollPosition'));
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
