import { savePushToken } from "@/actions/notification.action";
import { useAuthContext } from "@/stores/context/AuthContext";
import Constants, { ExecutionEnvironment } from "expo-constants";
import type { EventSubscription, Notification } from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

export const usePushNotifications = () => {
    const { session } = useAuthContext();
    const router = useRouter();
    const [expoPushToken, setExpoPushToken] = useState<string>("");
    const [notification, setNotification] = useState<Notification | null>(null);
    const notificationListener = useRef<EventSubscription | null>(null);
    const responseListener = useRef<EventSubscription | null>(null);

    useEffect(() => {
        if (Platform.OS === "web") return;

        const isExpoGo = Constants.appOwnership === "expo" ||
            Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

        if (isExpoGo && Platform.OS === "android") return;

        let isMounted = true;

        const setupNotifications = async () => {
            try {
                const Notifications = await import("expo-notifications");

                Notifications.setNotificationHandler({
                    handleNotification: async () => ({
                        shouldShowAlert: true,
                        shouldPlaySound: true,
                        shouldSetBadge: true,
                        shouldShowBanner: true,
                        shouldShowList: true
                    })
                })

                if (Platform.OS === "android") {
                    await Notifications.setNotificationChannelAsync("messages", {
                        name: "Messages",
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: "#0D92F4"
                    })
                }

                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;

                if (existingStatus !== "granted") {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }

                if (finalStatus === "granted") {
                    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
                    const tokenResponse = await Notifications.getExpoPushTokenAsync({
                        projectId
                    })

                    if (tokenResponse?.data && isMounted) {
                        setExpoPushToken(tokenResponse.data);
                    }
                }

                if (isMounted) {
                    notificationListener.current = Notifications.addNotificationReceivedListener(item => {
                        setNotification(item);
                    })

                    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
                        const data = response.notification.request.content.data;
                        if (data?.conversationId) {
                            router.push({
                                pathname: "/messages/[id]",
                                params: {
                                    id: String(data.conversationId)
                                }
                            })
                        }
                    })
                }
            } catch {
                return;
            }
        }

        setupNotifications();

        return () => {
            isMounted = false;
            notificationListener.current?.remove();
            responseListener.current?.remove();
        }
    }, [router])

    useEffect(() => {
        if (Platform.OS === "web" || !session?.user?.id || !expoPushToken) return;

        savePushToken({
            userId: session.user.id,
            pushToken: expoPushToken,
            platform: Platform.OS
        }).catch(() => null)
    }, [
        session?.user?.id,
        expoPushToken
    ])

    return {
        expoPushToken,
        notification
    }
}
