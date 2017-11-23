import _ from 'lodash';

const types = {
  SHOW_MODAL: 'PROFILE_IMAGE_SHOW_MODAL',
  SET_IMAGE: 'PROFILE_IMAGE_SET_IMAGE'
};

export const showModal = (isVisible) => ({
  type: types.SHOW_MODAL,
  isVisible
});

export const setImage = (fileName, data) => ({
  type: types.SET_IMAGE,
  fileName,
  data
});


const initialState = {
  showModal: false,
  fileName: null,
  data: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SHOW_MODAL:
      return {
        ...state,
        showModal: action.isVisible
      };
    case types.SET_IMAGE:
      return {
        ...state,
        fileName: action.fileName,
        data: action.data
      };
    default:
      return state;
  };
};

export default {
  reducer
};
