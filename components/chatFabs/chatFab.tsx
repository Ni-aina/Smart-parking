import useChatFABAnimation from "@/hooks/fabs/useChatFabAnimation";
import { usePathname } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import ChatWindow from "./chatWindow";
import FabButton from "./fabButton";

const ChatFAB = () => {
    const { isOpen, scaleAnim, toggle, close } = useChatFABAnimation();
    const pathname = usePathname();

    useEffect(()=> {
        close()
    }, [pathname])

    return (
        <View
            style={[
                styles.container,
                isOpen ? {
                    width: "100%",
                    height: "100%",
                    top: 100,
                    left: 20
                } : {
                    bottom: 100,
                    right: 20
                }
            ]}
            pointerEvents="box-none"
        >
            {
                isOpen ?
                    <ChatWindow
                        scaleAnim={scaleAnim}
                        onClose={close}
                    />
                    :
                    <FabButton onPress={toggle} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        zIndex: 999,
        backgroundColor: "transparent"
    }
})

export default ChatFAB;