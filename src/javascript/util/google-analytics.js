import ReactGA from 'react-ga';

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
