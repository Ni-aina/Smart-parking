import { getPushTokenEnabled, setPushTokenEnabled } from "@/actions/notification.action";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useExpoTokenContext } from "./ExpoTokenContext";

interface NotificationContextInterface {
    isAppUpdatesEnabled: boolean;
    isMessagesEnabled: boolean;
    handleSwitchUpdateEnabled: () => Promise<void>;
    handleSwitchMessageEnabled: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextInterface | undefined>(undefined)

const NotificationContextProvider = ({ children }: { children: ReactNode }) => {
    const [isAppUpdatesEnabled, setIsAppUpdatesEnabled] = useState(true)
    const [isMessagesEnabled, setIsMessagesEnabled] = useState(true)

    const { currentProfile } = useCurrentProfile()
    const { expoPushToken: pushToken } = useExpoTokenContext()

    const handleSwitchUpdateEnabled = async () => {
        try {
            if (!currentProfile?.id || !pushToken) throw new Error()
            const { id: userId } = currentProfile
            const isEnabled = !isAppUpdatesEnabled

            setIsAppUpdatesEnabled(isEnabled)

            const isSetted = await setPushTokenEnabled(
                userId,
                pushToken,
                {
                    enabledUpdates: isEnabled,
                    enabledMessages: isMessagesEnabled
                }
            )

            if (!isSetted) throw new Error()
        } catch (error) {
            setIsAppUpdatesEnabled(isAppUpdatesEnabled)
        }
    }

    const handleSwitchMessageEnabled = async () => {
        try {
            if (!currentProfile?.id || !pushToken) throw new Error()
            const { id: userId } = currentProfile
            const isEnabled = !isMessagesEnabled

            setIsMessagesEnabled(isEnabled)

            const isSetted = await setPushTokenEnabled(
                userId,
                pushToken,
                {
                    enabledUpdates: isAppUpdatesEnabled,
                    enabledMessages: isEnabled
                }
            )

            if (!isSetted) throw new Error()
        } catch {
            setIsMessagesEnabled(isMessagesEnabled)
        }
    }

    useEffect(() => {
        (async () => {
            try {
                if (!currentProfile?.id || !pushToken) return
                const { id: userId } = currentProfile

                const token = await getPushTokenEnabled(
                    userId,
                    pushToken
                )

                if (!token) throw new Error()

                setIsAppUpdatesEnabled(token.enabledUpdates)
                setIsMessagesEnabled(token.enabledMessages)
            }
            catch {
                setIsAppUpdatesEnabled(true)
                setIsMessagesEnabled(true)
            }
        })()

    }, [currentProfile?.id, pushToken])

    return (
        <NotificationContext.Provider value={{
            isAppUpdatesEnabled,
            isMessagesEnabled,
            handleSwitchUpdateEnabled,
            handleSwitchMessageEnabled
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

const useNotificationContext = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error("This context cannot be used outside of notification context provider")
    }
    return context
}

export { NotificationContextProvider, useNotificationContext };
