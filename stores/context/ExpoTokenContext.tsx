import { createContext, ReactNode, useContext } from "react";

const ExpoTokenContext = createContext<{
    expoPushToken: string
}>({
    expoPushToken: ""
})

export const ExpoTokenContextProvider = ({
    expoPushToken,
    children
}: {
    expoPushToken: string
    children: ReactNode
}) => {

    return (
        <ExpoTokenContext.Provider value={{ expoPushToken }}>
            {children}
        </ExpoTokenContext.Provider>
    )
}

export const useExpoTokenContext = () => {
    const expoPushTokenContext = useContext(ExpoTokenContext);
    if (!expoPushTokenContext) throw new Error("This context cannot be use outside of expo token context");
    return {
        expoPushToken: expoPushTokenContext.expoPushToken
    }
}
