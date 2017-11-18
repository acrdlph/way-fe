
export const requestPermissionForNotifications = () => {
  if(FEATURE_NOTIFICATIONS) {
    Notification.requestPermission();
  }
};
