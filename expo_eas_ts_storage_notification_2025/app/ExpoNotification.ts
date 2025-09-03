import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Alert } from 'react-native';

const isIOS = Device.osName?.toLowerCase() === "ios";
const isAndroid = Device.osName?.toLowerCase() === "android";
const isWindows = Device.osName?.toLowerCase() === "windows";
const isMacOS = Device.osName?.toLowerCase() === "macos";
const isLinux = Device.osName?.toLowerCase() === "linux";

export const expoRemoveNotificationsAsync = () => {
  const promises: Array<Promise<any>> = [];

  console.log("Dismissing notification from status bar");
  const dismissAllPromise: Promise<void> = Notifications.dismissAllNotificationsAsync();
  promises.push(dismissAllPromise);
  console.log("Removing all notification. Notifications.cancelAllScheduledNotificationsAsync()");
  const cancelAllPromise: Promise<void> = Notifications.cancelAllScheduledNotificationsAsync();
  promises.push(cancelAllPromise);
  console.log("Removing individual notifications");


  Notifications.getAllScheduledNotificationsAsync()
    .then(expoNotificationArray => expoNotificationArray.forEach(expoNotification => {
      console.log("Removing and dismissing notification: ", expoNotification.identifier);
      const dismissPromise = Notifications.dismissNotificationAsync(expoNotification.identifier);
      promises.push(dismissPromise);

      const cancelPromise = Notifications.cancelScheduledNotificationAsync(expoNotification.identifier);
      promises.push(cancelPromise);
    }));

  return Promise.all(promises);
}

export const expoScheduleNotificationAsync = async (title: string, message: string, date: Date): Promise<string> => {
  // if (!isNotificationPossible()) {
  //   return Promise.reject("Notifications not possible on this device");
  // }
  console.log("Scheduling notification for date: ", date.toTimeString());

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: message,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DATE,
      channelId: 'default', // Required for Android
      date,                 // Schedule for a specific date/time
    },
  });
}


// https://docs.expo.dev/push-notifications/push-notifications-setup/
// returns boolean if registration was successful
export const expoRegisterForNotificationsAsync = async (): Promise<boolean> => {
  let result = false;
  const {status: existingStatus} = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const {status} = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Notification permission', "Unable to set notification.");
  } else {
    result = true;
  }


  Notifications.setNotificationHandler({
      handleNotification: async () => ({
        // shouldShowAlert: true, // Deprecated, use shouldShowBanner
        shouldShowBanner: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowInForeground: true,
        shouldShowList: true,
      }),
    });


    // If needed. Do this only on android.
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
  

  return result;
};

export const isNotificationPossible = (): boolean => {
  if (!Device.isDevice && isAndroid) {
    Alert.alert('No device!', "Must use physical device for Notifications.");
  }
  return Device.isDevice;
};
