import notifee, { AndroidImportance } from "@notifee/react-native";
import {
  FirebaseMessagingTypes,
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

const messaging = getMessaging();

// Channel creation
(async () => {
  await notifee.createChannel({
    id: "default",
    name: "Kemhan Channel",
    importance: AndroidImportance.HIGH,
  });
})();

// ✅ Background handler
setBackgroundMessageHandler(
  messaging,
  async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    const title =
      (remoteMessage.data?.title as string) ??
      (remoteMessage.notification?.title as string);
    const body =
      (remoteMessage.data?.body as string) ??
      (remoteMessage.notification?.body as string);

    if (title && body) {
      await notifee.displayNotification({
        title,
        body,
        android: {
          channelId: "default",
          sound: "default",
          smallIcon: "notification_icon",
          color: "#1B4332",
          pressAction: { id: "default" },
        },
      });
    }
  }
);
