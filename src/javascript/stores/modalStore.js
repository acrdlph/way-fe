const types = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE'
};

export const showTheModal = (isVeryVisible) => ({
  type: types.OPEN,
  isVeryVisible
});

const initialState = {
  showTheModal: false
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case types.OPEN:
      return{
        ...state,
        showTheModal: action.isVeryVisible,
      };
    default:
      return state;
  };
};

export default {
  reducer
};