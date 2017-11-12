import _ from 'lodash';

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
        return createUserDirectory(action.data);
    default:
      return state;
  };
};

export default {
  reducer
};
