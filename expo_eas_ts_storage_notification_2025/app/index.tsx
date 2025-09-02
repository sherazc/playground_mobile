import {
  expoRegisterForNotificationsAsync,
  expoRemoveNotificationsAsync,
  expoScheduleNotificationAsync
} from "@/app/ExpoNotification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

Notifications.setNotificationChannelAsync('default', {
  name: 'Default',
  importance: Notifications.AndroidImportance.HIGH,
  vibrationPattern: [0, 250, 250, 250],
  lightColor: '#FF231F7C',
});


Notifications.setNotificationHandler({
  handleNotification: () => {
    return new Promise<Notifications.NotificationBehavior>(() => {
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }
    })
  }
});


export default function Index() {

  const [myStorage, setMyStorage] = useState<string>("Nothing stored yet")

  const handleSetStorage = () => {
    console.log("Set value in storage");
    AsyncStorage.setItem("myStorage", "New Value: " + new Date().toISOString());
  }

  useEffect(() => {

    // If needed. Do this only on android.
    Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });


    Notifications.setNotificationHandler({
      handleNotification: () => {
        return new Promise<Notifications.NotificationBehavior>(() => {
          return {
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowInForeground: true,
            shouldShowList: true,
          }
        })
      }
    });


  }, []);


  const handleGetStorage = () => {
    console.log("Get value from storage");
    AsyncStorage.getItem("myStorage").then(value => setMyStorage(value as string));
  }

  const handleShowNotification = () => {
    expoRemoveNotificationsAsync().then(() => { // Successfully removed
      expoRegisterForNotificationsAsync().then(registered => {
        if (registered) {
          try {
            console.log("Setting up notifications.");
            const date = new Date();
            date.setSeconds(date.getSeconds() + 5);

            expoScheduleNotificationAsync("Notification test", `Message ${new Date().toISOString()}`, date)
              .then(() => console.log("Successfully set notification"))
              .catch(e => console.log("Failed set notification"));
          } catch (error) {
            console.log("Failed set notification, exception occurred", error);
          }
        } else {
          console.log("Failed set notification. Device not registered");
        }
      });


    }, (reason: any) => console.log("Failed to remove previously set notifications.", reason)); // Failed to remove notification
  }


  const handleShowNotification2 = () => {
    console.log("Showing notification 2");
  }


  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ScrollView>
        <TouchableOpacity onPress={handleSetStorage}>
          <Text>Set value in store</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleGetStorage}>
          <Text>get value from store</Text>
        </TouchableOpacity>

        <Text>{myStorage}</Text>

        <TouchableOpacity onPress={handleShowNotification}>
          <Text>Show Notification 0</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShowNotification2}>
          <Text>Show Notification 1</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}
