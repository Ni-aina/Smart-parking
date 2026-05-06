import { webBaseUrl } from "@/config";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme.web";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { useLocationStore } from "@/stores/zustand/location";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";
import ChatHeader from "./chatHeader";
import ChatSendButton from "./chatSendButton";

const BOT_USER = { _id: Math.random().toString(), name: "Parking Assistant" }
type Props = {
    scaleAnim: Animated.Value;
    onClose: () => void;
}

const ChatWindow = ({ scaleAnim, onClose }: Props) => {
    const { currentProfile } = useCurrentProfile();
    const ME = useMemo(() => currentProfile ? {
        _id: currentProfile.id,
        name: currentProfile.fullName
    } : undefined, [
        currentProfile?.id,
        currentProfile?.fullName
    ])

    const { location } = useLocationStore();

    const colorscheme = useColorScheme() || "light";
    const colors = Colors[colorscheme];

    const [messages, setMessages] = useState<IMessage[]>([
        {
            _id: 1,
            text: "Hello! I'm your parking assistant. I can help you find and reserve a parking space. Would you like to start a new search?",
            createdAt: new Date(),
            user: BOT_USER
        }
    ])
    const [history, setHistory] = useState<{
        role: string;
        content: string;
    }[]>([])

    const [pending, setIsPending] = useState(false);

    const onSend = useCallback((newMessages: IMessage[] = []) => {
        setMessages(prev => GiftedChat.append(prev, newMessages));

        setHistory(prev => [...prev, ...newMessages.map(message => ({
            role: message.user._id === ME?._id ? "user" : "assistant",
            content: message.text
        }))])
    }, [ME])

    useEffect(() => {
        if (!history.length) return;

        (async () => {
            try {
                setIsPending(true);
                const response = await fetch(`${webBaseUrl}/api/ai/chat`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        messages: history,
                        driverId: ME?._id,
                        latitude: location?.latitude,
                        longitude: location?.longitude
                    })
                })
                const data = await response.json();

                if (data.error) throw new Error(`${data.error}`);

                if (data.message) {
                    setMessages(prev =>
                        GiftedChat.append(prev, [
                            {
                                _id: Math.random().toString(),
                                text: data.message,
                                createdAt: new Date(),
                                user: BOT_USER
                            }
                        ])
                    )
                }
            } catch (error) {
                console.error(error);
                setMessages(prev =>
                    GiftedChat.append(prev, [
                        {
                            _id: Math.random().toString(),
                            text: "Something went wrong, please try again later.",
                            createdAt: new Date(),
                            user: BOT_USER
                        }
                    ])
                )
            } finally {
                setIsPending(false);
            }
        })()
    }, [
        ME,
        location,
        history
    ])

    return (
        <Animated.View
            style={[
                styles.window,
                {
                    backgroundColor: colors.background,
                    borderColor: colors.gray200,
                    transform: [{ scale: scaleAnim }],
                    opacity: scaleAnim
                }
            ]}
        >
            <ChatHeader onClose={onClose} />
            <View style={styles.chatContainer}>
                <GiftedChat
                    messages={messages}
                    onSend={onSend}
                    isTyping={pending}
                    user={ME}
                    isSendButtonAlwaysVisible
                    keyboardAvoidingViewProps={{ keyboardVerticalOffset: 160 }}
                    messagesContainerStyle={{ backgroundColor: colors.background }}
                    textInputProps={{
                        placeholderTextColor: colors.icon,
                        style: { color: colors.text, backgroundColor: colors.background }
                    }}
                    renderDay={() => null}
                    renderBubble={props => (
                        <Bubble
                            {...props}
                            wrapperStyle={{
                                right: { backgroundColor: colors.tint },
                                left: { backgroundColor: colors.gray200 }
                            }}
                            textStyle={{
                                right: { color: colors.background },
                                left: { color: colors.text }
                            }}
                        />
                    )}
                    renderSend={props => <ChatSendButton {...props} />}
                />
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    window: {
        width: "90%",
        height: "78%",
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 0.5,
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10
    },
    chatContainer: {
        flex: 1,
        padding: 8
    },
    textInput: {
        borderRadius: 20,
        paddingHorizontal: 12,
        flex: 1
    }
})

export default ChatWindow;