import ReactGA from 'react-ga';

export const actions = {
  USER_SELECTED_LOCATION: 'User selected a location',
  USER_CHANGED_WAITING_TIME: 'User changed waiting time',
  USER_UPLOADED_PROFILE_PHOTO: 'User uploaded profile photo',
  USER_FILLED_OUT_PROFILE_FORM: 'User filled out profile form',
  USER_SEND_MESSAGE: 'User send chat message'
};

export const initializeGoogleAnalytics = () => {
  if(GOOGLE_ANALYTICS_ID.length > 0) {
    ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
      debug: DEVELOPMENT_MODE
    });
  }
};

export const trackPageView = (path) => {
  if(GOOGLE_ANALYTICS_ID.length > 0) {
    ReactGA.pageview(path);
  }
};

export const trackEvent = (action, value) => {
  if(GOOGLE_ANALYTICS_ID.length > 0) {
    ReactGA.event({
      category: 'User',
      action,
      value
    });
  }
};
