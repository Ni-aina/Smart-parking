import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, TouchableOpacity, useColorScheme, View } from "react-native";
import { IMessage, SendProps } from "react-native-gifted-chat";

const ChatSendButton = (props: SendProps<IMessage>) => {
    const colorscheme = useColorScheme() || "light";
    const colors = Colors[colorscheme];

    return (
        <View
            style={{
                backgroundColor: colors.background,
                position: "absolute",
                right: 0,
                bottom: 0
            }}
        >
            <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.gray200 }]}
                onPress={() => props.onSend?.({ text: props.text?.trim() ?? "" }, true)}
            >
                <Ionicons
                    name="send"
                    size={16}
                    color={colors.tint}
                    style={{
                        transform: [{ rotate: "-45deg" }]
                    }}
                />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        width: 36,
        height: 36,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center"
    }
})

export default ChatSendButton;