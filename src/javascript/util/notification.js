const notificationOptions = {
  icon: 'assets/waitlistlogo.svg'
};

export const requestPermissionForNotifications = () => {
  if(FEATURE_NOTIFICATIONS) {
    Notification.requestPermission();
  }
};

export const notify = (message) => {
  if(FEATURE_NOTIFICATIONS) {
    if (Notification.permission === "granted") {
      new Notification(message, notificationOptions);
    }
  }
};
