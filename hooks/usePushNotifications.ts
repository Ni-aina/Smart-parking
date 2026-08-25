import { savePushToken } from "@/actions/notification.action";
import { Colors } from "@/constants/Colors";
import { useAuthContext } from "@/stores/context/AuthContext";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import type { TFunction } from "i18next";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, useColorScheme } from "react-native";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true
    })
})

const handleRegistrationError = (errorMessage: string) => {
    alert(errorMessage)
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync(
    colorscheme: "light" | "dark",
    t: TFunction<"translation", undefined>
) {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: Colors[colorscheme].tint,
        })
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        handleRegistrationError(t("push_notification_permission_not_granted"));
        return;
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
        handleRegistrationError(t("push_notification_project_id_not_found"));
    }

    try {
        const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
                projectId,
            })
        ).data;
        return pushTokenString;
    } catch (e: unknown) {
        handleRegistrationError(`${e}`);
    }
}

export const usePushNotifications = () => {
    const { session } = useAuthContext();

    const { t } = useTranslation();
    const colorscheme = useColorScheme() || "light";

    const router = useRouter();
    const [expoPushToken, setExpoPushToken] = useState<string>("");
    const [notification, setNotification] = useState<Notifications.Notification | undefined>();

    useEffect(() => {
        if (Platform.OS === "web") return

        registerForPushNotificationsAsync(colorscheme, t)
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error: unknown) => setExpoPushToken(`${error}`));

        const notificationListener = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        })

        const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
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

        return () => {
            notificationListener.remove();
            responseListener.remove();
        }
    }, [
        t,
        colorscheme,
        router
    ])

    useEffect(() => {
        if (Platform.OS === "web" || !session?.user?.id || !expoPushToken) return

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