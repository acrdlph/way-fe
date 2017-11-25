import Push from 'push.js';

const notificationOptions = {
  icon: 'assets/waitlistlogo.svg'
};

export const requestPermissionForNotifications = () => {
  if(FEATURE_NOTIFICATIONS) {
    Push.Permission.request();
  }
};

export const notify = (message) => {
  if(FEATURE_NOTIFICATIONS) {
    if (Push.Permission.has()) {
      Push.create(message, notificationOptions);
    }
  }
};
