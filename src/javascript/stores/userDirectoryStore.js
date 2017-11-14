import _ from 'lodash';

const addUserToDirectory = (userDetails) => {
  const users = {};
  let name = userDetails.name;
  if(name && name.trim() === '') {
    name = 'Anonymous';
  }
  users[userDetails.id] = name;
  return users;
};

const createUserDirectory = (data) => {
  const users ={};
  _.each(data, user => {
    let name = user.name;
    if(name.trim() === '') {
      name = 'Anonymous';
    }
    users[user.id] = name;
  });
  return users;
};

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'WAITLIST_LOADED':
      return _.assign(state, createUserDirectory(action.data));
    case 'USER_LOADED':
      return _.assign(state, addUserToDirectory(action.data));
    default:
      return state;
  };
};

export default {
  reducer
};