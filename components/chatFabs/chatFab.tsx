import useChatFABAnimation from "@/hooks/fab/useChatFabAnimation";
import { useAuthContext } from "@/stores/context/AuthContext";
import { usePathname } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Loading from "../ui/loading";
import ChatWindow from "./chatWindow";
import FabButton from "./fabButton";

const ChatFAB = () => {
    const {
        session,
        loading
    } = useAuthContext();

    if (loading) return <Loading />;

    if (!session) return null;

    const {
        isOpen,
        scaleAnim,
        toggle,
        close
    } = useChatFABAnimation();
    const pathname = usePathname();

    useEffect(() => {
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