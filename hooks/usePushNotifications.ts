import { savePushToken } from "@/actions/notification.action";
import { useAuthContext } from "@/stores/context/AuthContext";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import type { TFunction } from "i18next";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Platform } from "react-native";

type NotificationsType = typeof import("expo-notifications")
type NotificationType = import("expo-notifications").Notification

const handleRegistrationError = (errorMessage: string) => Alert.alert(errorMessage)

const registerForPushNotificationsAsync = async (
    Notifications: NotificationsType,
    t: TFunction<"translation", undefined>
) => {
    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C"
        })
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
    }

    if (finalStatus !== "granted") {
        handleRegistrationError(t("push_notification_permission_not_granted"))
        return
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId
    if (!projectId) {
        handleRegistrationError(t("push_notification_project_id_not_found"))
        return
    }

    try {
        const pushTokenString = (
            await Notifications.getExpoPushTokenAsync({
                projectId
            })
        ).data
        return pushTokenString
    } catch (e: unknown) {
        handleRegistrationError(`${e}`)
    }
}

export const usePushNotifications = () => {
    const { session } = useAuthContext()

    const { t } = useTranslation()

    const router = useRouter()
    const [expoPushToken, setExpoPushToken] = useState<string>("")
    const [notification, setNotification] = useState<NotificationType | undefined>()

    const notificationListenerRef = useRef<ReturnType<NotificationsType["addNotificationReceivedListener"]> | undefined>(undefined)
    const responseListenerRef = useRef<ReturnType<NotificationsType["addNotificationResponseReceivedListener"]> | undefined>(undefined)

    useEffect(() => {
        const isExpoGo = Constants.appOwnership === "expo"

        if (Platform.OS === "web" || isExpoGo) return

        const setup = async () => {
            const Notifications = await import("expo-notifications")

            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                    shouldPlaySound: true,
                    shouldSetBadge: true,
                    shouldShowBanner: true,
                    shouldShowList: true
                })
            })

            registerForPushNotificationsAsync(Notifications, t)
                .then(token => setExpoPushToken(token ?? ""))
                .catch((error: unknown) => setExpoPushToken(`${error}`))

            notificationListenerRef.current = Notifications.addNotificationReceivedListener(received => {
                setNotification(received)
            })

            responseListenerRef.current = Notifications.addNotificationResponseReceivedListener(response => {
                const data = response.notification.request.content.data
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

        setup()

        return () => {
            notificationListenerRef.current?.remove()
            responseListenerRef.current?.remove()
        }
    }, [
        t,
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