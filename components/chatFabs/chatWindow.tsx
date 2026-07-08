import { webBaseUrl } from "@/config";
import { Colors } from "@/constants/Colors";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { supabase } from "@/lib/supabase";
import { useLocationStore } from "@/stores/zustand/location";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, StyleSheet, useColorScheme, View } from "react-native";
import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";
import ChatHeader from "./chatHeader";
import ChatSendButton from "./chatSendButton";

type Props = {
    scaleAnim: Animated.Value;
    onClose: () => void;
}

const ChatWindow = ({ scaleAnim, onClose }: Props) => {
    const { t, i18n } = useTranslation();
    const { currentProfile } = useCurrentProfile();

    const BOT_USER = useMemo(() => ({
        _id: "bot",
        name: t("chat_assistant")
    }), [t]);

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

    const [messages, setMessages] = useState<IMessage[]>(() => [
        {
            _id: 1,
            text: t("chat_greeting"),
            createdAt: new Date(),
            user: BOT_USER
        }
    ])

    const [pending, setIsPending] = useState(false);

    const buildHistory = (messages: IMessage[]) =>
        messages
            .map(message => ({
                role: message.user._id === ME?._id
                    ? "user"
                    : "assistant" as const,
                content: message.text
            }))
            .reverse()

    const onSend = useCallback(async (newMessages: IMessage[] = []) => {
        try {
            setIsPending(true);

            setMessages(prev => {
                const updatedMessages = GiftedChat.append(prev, newMessages);

                (async () => {
                    try {
                        const { data: session } = await supabase.auth.getSession();

                        const accessToken = session?.session?.access_token;

                        if (!accessToken) {
                            throw new Error("User is not authenticated");
                        }

                        const response = await fetch(`${webBaseUrl}/api/protected/ai/chat`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${accessToken}`
                            },
                            body: JSON.stringify({
                                messages: buildHistory(updatedMessages),
                                driverId: ME?._id,
                                latitude: location?.latitude,
                                longitude: location?.longitude,
                                timezoneOffset: new Date().getTimezoneOffset() * -1,
                                i18nLanguage: i18n.language || "en"
                            })
                        })

                        const data = await response.json();

                        if (data.error) {
                            throw new Error(data.error);
                        }

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
                    } catch {
                        setMessages(prev =>
                            GiftedChat.append(prev, [
                                {
                                    _id: Math.random().toString(),
                                    text: t("chat_error"),
                                    createdAt: new Date(),
                                    user: BOT_USER
                                }
                            ])
                        )
                    } finally {
                        setIsPending(false);
                    }
                })()

                return updatedMessages;
            })
        } catch {
            setIsPending(false);
        }
    }, [
        ME?._id,
        location?.latitude,
        location?.longitude,
        BOT_USER,
        t,
        i18n.language
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
                    keyboardAvoidingViewProps={{ keyboardVerticalOffset: 165 }}
                    messagesContainerStyle={{ backgroundColor: colors.background }}
                    textInputProps={{
                        placeholder: t("chat_placeholder"),
                        placeholderTextColor: colors.icon,
                        style: {
                            color: colors.text,
                            backgroundColor: colors.background,
                            paddingRight: 40
                        }
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