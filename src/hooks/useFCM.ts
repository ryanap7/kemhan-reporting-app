import notifee from "@notifee/react-native";
import {
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
} from "@react-native-firebase/messaging";
import { useEffect } from "react";
import { AuthService, SecureTokenManager } from "../api";

export const useFCM = () => {
  useEffect(() => {
    const messaging = getMessaging();

    const handleTap = (msg: FirebaseMessagingTypes.RemoteMessage) => {
      console.log("Tapped", msg);
    };

    const saveFCMToken = async (token: string) => {
      try {
        const accessToken = await SecureTokenManager.getToken();

        if (!accessToken) {
          console.log("⚠️ User belum login, skip save FCM token");
          return;
        }

        // Cek token lama
        const oldToken = await SecureTokenManager.getFcmToken();

        // Jika token berbeda, simpan ke backend
        if (oldToken !== token) {
          await AuthService.storeFcmToken(token);

          // Simpan ke local storage
          await SecureTokenManager.setFcmToken(token);
          console.log("✅ FCM token saved successfully");
        }
      } catch (error) {
        console.error("❌ Error saving FCM token:", error);
      }
    };

    const setup = async () => {
      try {
        // ✅ Permission
        await notifee.requestPermission();

        // ✅ Get FCM token
        const token = await getToken(messaging);

        // ✅ Save token to backend
        await saveFCMToken(token);

        // ✅ Foreground handler
        const unsubscribeMessage = onMessage(
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

        // ✅ Background handler (app in background, user taps notification)
        const unsubscribeOpen = onNotificationOpenedApp(messaging, (msg) => {
          if (msg) handleTap(msg);
        });

        // ✅ Terminated handler
        const initial = await getInitialNotification(messaging);
        if (initial) {
          handleTap(initial);
        }

        return () => {
          unsubscribeMessage();
          unsubscribeOpen();
        };
      } catch (err) {
        console.error("❌ Error saat init useFCM", err);
      }
    };

    let cleanup: (() => void) | undefined;

    setup().then((unsub) => {
      cleanup = unsub;
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);
};
