const types = {
  ONBOARD: 'OPEN_ONBOARDING',
  INCOMPLETE: 'OPEN_INCOMPLETE',
};

export const showOnboardingList = showModal => ({
  type: types.ONBOARD,
  showModal,
});

export const showIncompleteModal = showModal => ({
  type: types.INCOMPLETE,
  showModal,
});

const initialState = {
  showOnboardingList: false,
  showIncompleteModal: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case types.ONBOARD:
      return {
        ...state,
        showOnboardingList: action.showModal,
      };
    case types.INCOMPLETE:
      return {
        ...state,
        showIncompleteModal: action.showModal,
      };
    default:
      return state;
  }
};

export default {
  reducer,
};
