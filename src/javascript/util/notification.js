export const requestPermissionForNotifications = () => {
  if(FEATURE_NOTIFICATIONS) {
    Notification.requestPermission();
  }
};

export const notify = (message) => {
  if(FEATURE_NOTIFICATIONS) {
    new Notification(message);
  }
};
