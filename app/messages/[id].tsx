import ErrorModal from "@/components/ui/errorModal";
import Header from "@/components/ui/header";
import { Colors } from "@/constants/Colors";
import useMessages from "@/hooks/messages/useMessages";
import useKeyboardVisible from "@/hooks/useKeyboardVisible";
import { MessageInterface } from "@/types/message";
import { ProfileInterface } from "@/types/profile";
import {
    formatMessageTime,
    shouldShowMessageTime
} from "@/utils/messageTime";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";

const Avatar = ({
    profile
}: {
    profile?: ProfileInterface;
}) => {
    const colorscheme = useColorScheme() || "light";
    const colors = Colors[colorscheme];

    if (profile?.urlImage) {
        return (
            <Image
                source={{ uri: profile.urlImage }}
                style={styles.avatar}
            />
        )
    }

    return (
        <View style={[styles.avatarFallback, { backgroundColor: colors.tint }]}>
            <Text style={[styles.avatarText, { color: colors.background }]}>
                {profile?.fullName?.at(0)?.toUpperCase() || "?"}
            </Text>
        </View>
    )
}

const AvatarSeen = ({
    profile
}: {
    profile?: ProfileInterface;
}) => {
    const colorscheme = useColorScheme() || "light";
    const colors = Colors[colorscheme];

    if (profile?.urlImage) {
        return (
            <Image
                source={{ uri: profile.urlImage }}
                style={styles.avatarSeen}
            />
        )
    }

    return (
        <View style={[styles.avatarSeenFallback, { backgroundColor: colors.tint }]}>
            <Text style={[styles.avatarSeenText, { color: colors.background }]}>
                {profile?.fullName?.at(0)?.toUpperCase() || "?"}
            </Text>
        </View>
    )
}

const MessageBubble = ({
    message,
    previousMessage,
    isMine,
    isLastMessage,
    isNotCurrentProfile,
    locale
}: {
    message: MessageInterface;
    previousMessage?: MessageInterface;
    isMine: boolean;
    isLastMessage: boolean;
    isNotCurrentProfile: ProfileInterface | undefined;
    locale: string;
}) => {
    const colorscheme = useColorScheme() || "light";
    const colors = Colors[colorscheme];
    const showTime = shouldShowMessageTime(
        message.createdAt,
        previousMessage?.createdAt
    )

    const isLastMessageSeen = isMine && message.isRead && isLastMessage;

    return (
        <View>
            {showTime && (
                <Text style={[styles.timeDivider, { color: colors.icon }]}>
                    {formatMessageTime(message.createdAt, locale)}
                </Text>
            )}
            <View style={[styles.messageRow, isMine && styles.messageRowMine]}>
                {!isMine && <Avatar profile={message.sender} />}
                <View>
                    <View
                        style={[
                            styles.messageBubble,
                            {
                                backgroundColor: isMine ? colors.tint : colors.gray200
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styles.messageContent,
                                { color: isMine ? colors.background : colors.text }
                            ]}
                        >
                            {message.content}
                        </Text>
                    </View>
                    {
                        isLastMessageSeen &&
                        <View
                            style={{
                                alignItems: "flex-end"
                            }}
                        >
                            <AvatarSeen profile={isNotCurrentProfile} />
                        </View>
                    }
                </View>
            </View>
        </View>
    )
}

const ConversationThreadScreen = () => {
    const { t, i18n } = useTranslation();
    const colorscheme = useColorScheme() || "light";
    const colors = Colors[colorscheme];
    const { id } = useLocalSearchParams<{ id: string }>();
    const listRef = useRef<FlatList<MessageInterface>>(null);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const isKeyboardVisible = useKeyboardVisible();

    const {
        conversation,
        messages,
        isLoading,
        handleSendAsync,
        isSending,
        currentProfile
    } = useMessages(id);

    const isNotCurrentProfile: ProfileInterface | undefined = conversation?.senderId !== currentProfile?.id ? conversation?.sender : conversation?.receiver;

    const otherUser = useMemo(() => {
        if (!conversation || !currentProfile?.id) return undefined;
        return conversation.senderId === currentProfile.id
            ? conversation.receiver
            : conversation.sender;
    }, [
        conversation,
        currentProfile?.id
    ])

    const submitMessage = async () => {
        const content = message.trim();
        if (!content || !currentProfile?.id || !id) return;

        try {
            await handleSendAsync({
                conversationId: Number(id),
                senderId: currentProfile.id,
                content
            })
            setMessage("");
        } catch {
            setErrorMessage(t("chat_error"));
        } finally {
            setTimeout(() => {
                setErrorMessage("")
            }, 3000)
        }
    }

    const isLastMessageChange = messages?.at(-1)?.isRead;

    useEffect(() => {
        if (!messages.length) return;
        setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, 80);
    }, [
        isLastMessageChange,
        messages.length
    ])

    return (
        <View
            style={styles.container}
        >
            <View style={{ paddingHorizontal: 20 }}>
                <Header
                    title={otherUser?.fullName || t("messages")}
                    rightIcon={<Avatar profile={otherUser} />}
                />
            </View>
            <KeyboardAvoidingView
                style={{
                    flex: 1,
                    paddingHorizontal: 20,
                    backgroundColor: colors.background
                }}
                behavior={isKeyboardVisible ? "padding" : undefined}
            >
                {
                    isLoading ?
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center"
                            }}
                        >
                            <ActivityIndicator
                                size="large"
                                color={Colors[colorscheme].tint}
                            />
                        </View>
                        :
                        <View style={styles.thread}>
                            <FlatList
                                ref={listRef}
                                data={messages}
                                keyExtractor={item => item.id.toString()}
                                contentContainerStyle={styles.messagesList}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, index }) => (
                                    <MessageBubble
                                        message={item}
                                        previousMessage={messages[index - 1]}
                                        isMine={item.senderId === currentProfile?.id}
                                        isLastMessage={index === messages.length - 1}
                                        isNotCurrentProfile={isNotCurrentProfile}
                                        locale={i18n.language}
                                    />
                                )}
                                ListEmptyComponent={
                                    <View style={styles.emptyMessages}>
                                        <Ionicons name="chatbubble-outline" size={54} color={colors.icon} />
                                        <Text style={[styles.emptyText, { color: colors.text }]}>
                                            {t("message_start_chat")}
                                        </Text>
                                    </View>
                                }
                            />
                            <View style={[styles.composer, { backgroundColor: colors.gray100 }]}>
                                <TextInput
                                    value={message}
                                    onChangeText={setMessage}
                                    placeholder={t("message_type_placeholder")}
                                    placeholderTextColor={colors.icon}
                                    style={[styles.input, { color: colors.text }]}
                                    multiline
                                />
                                <Pressable
                                    disabled={!message.trim() || isSending}
                                    onPress={submitMessage}
                                    style={({ pressed }) => [
                                        styles.sendButton,
                                        { backgroundColor: colors.background },
                                        (pressed || !message.trim() || isSending) && styles.pressed
                                    ]}
                                >
                                    {
                                        isSending ?
                                            <ActivityIndicator
                                                size={28}
                                                color={Colors[colorscheme].text}
                                            />
                                            :
                                            <Ionicons name="send" size={20} color={colors.text} />
                                    }
                                </Pressable>
                            </View>
                        </View>
                }
            </KeyboardAvoidingView>

            <ErrorModal
                visible={!!errorMessage}
                message={errorMessage}
                onClose={() => setErrorMessage("")}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 48,
        gap: 10
    },
    thread: {
        flex: 1,
        gap: 12
    },
    messagesList: {
        flexGrow: 1,
        paddingVertical: 12,
        gap: 8
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 8,
        marginVertical: 3,
        maxWidth: "86%"
    },
    messageRowMine: {
        alignSelf: "flex-end",
        justifyContent: "flex-end"
    },
    messageBubble: {
        borderRadius: 21,
        paddingHorizontal: 14,
        paddingVertical: 10,
        maxWidth: "100%"
    },
    messageContent: {
        fontSize: 16,
        lineHeight: 22
    },
    timeDivider: {
        alignSelf: "center",
        fontSize: 12,
        fontWeight: "600",
        marginVertical: 12
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18
    },
    avatarFallback: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center"
    },
    avatarText: {
        fontSize: 12,
        fontWeight: "800"
    },
    avatarSeen: {
        width: 12,
        height: 12,
        borderRadius: 6
    },
    avatarSeenFallback: {
        width: 12,
        height: 12,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center"
    },
    avatarSeenText: {
        fontSize: 5
    },
    composer: {
        minHeight: 54,
        borderRadius: 21,
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 10,
        padding: 8,
        marginBottom: 14
    },
    input: {
        flex: 1,
        maxHeight: 120,
        minHeight: 38,
        fontSize: 16,
        paddingHorizontal: 8,
        paddingVertical: 8
    },
    sendButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        transform: [{ rotate: "-45deg" }],
        alignItems: "center",
        justifyContent: "center"
    },
    emptyMessages: {
        flex: 1,
        minHeight: 300,
        alignItems: "center",
        justifyContent: "center",
        gap: 10
    },
    emptyText: {
        fontSize: 17,
        fontWeight: "700",
        textAlign: "center"
    },
    pressed: {
        opacity: 0.65
    }
})

export default ConversationThreadScreen;
