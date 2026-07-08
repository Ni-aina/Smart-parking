import NoDataFound from "@/components/NoDataFound";
import Header from "@/components/ui/header";
import LoaderSkeleton from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import useConversations from "@/hooks/messages/useConversations";
import { ConversationInterface } from "@/types/message";
import { ProfileInterface } from "@/types/profile";
import { formatRelativeMessageTime } from "@/utils/messageTime";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    useWindowDimensions,
    View
} from "react-native";

const getInitials = (name?: string) =>
    name
        ?.split(" ")
        .slice(0, 2)
        .map(part => part.at(0)?.toUpperCase())
        .join("") || "?";

const ProfileAvatar = ({
    profile,
    size = 52
}: {
    profile?: ProfileInterface;
    size?: number;
}) => {
    const colorscheme = useColorScheme() || "light";
    const colors = Colors[colorscheme];

    if (profile?.urlImage) {
        return (
            <Image
                source={{ uri: profile.urlImage }}
                style={[
                    styles.avatar,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2
                    }
                ]}
            />
        )
    }

    return (
        <View
            style={[
                styles.avatarFallback,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: colors.tint
                }
            ]}
        >
            <Text style={[styles.avatarText, { color: colors.background }]}>
                {getInitials(profile?.fullName)}
            </Text>
        </View>
    )
}

const ConversationItem = ({
    conversation,
    currentUserId,
    onPress
}: {
    conversation: ConversationInterface;
    currentUserId: string;
    onPress: () => void;
}) => {
    const { t } = useTranslation();
    const colorscheme = useColorScheme() || "light";
    const colors = Colors[colorscheme];
    const otherUser = conversation.senderId === currentUserId
        ? conversation.receiver
        : conversation.sender;
    const lastMessage = conversation.lastMessage;
    const isMine = lastMessage?.senderId === currentUserId;

    return (
        <Pressable
            onPress={onPress}
            android_ripple={{ color: colors.gray100 }}
            style={({ pressed }) => [
                styles.conversationItem,
                {
                    backgroundColor: colors.gray200
                },
                pressed && styles.pressed
            ]}
        >
            <ProfileAvatar profile={otherUser} />
            <View style={styles.conversationBody}>
                <View style={styles.conversationTitleRow}>
                    <Text
                        numberOfLines={1}
                        style={[styles.conversationName, { color: colors.text }]}
                    >
                        {otherUser?.fullName || t("default_user")}
                    </Text>
                    <Text style={[styles.conversationTime, { color: colors.icon }]}>
                        {lastMessage?.createdAt
                            ? formatRelativeMessageTime(lastMessage.createdAt, t)
                            : formatRelativeMessageTime(conversation.createdAt, t)
                        }
                    </Text>
                </View>
                <Text
                    numberOfLines={1}
                    style={[styles.lastMessage, { color: colors.icon }]}
                >
                    {lastMessage?.content
                        ? `${isMine ? t("message_you_prefix") : ""}${isMine ? ": " : ""}${lastMessage.content}`
                        : t("message_no_messages_yet")
                    }
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.icon} />
        </Pressable>
    )
}

const MessageScreen = () => {
    const { t } = useTranslation();
    const colorscheme = useColorScheme() || "light";
    const colors = Colors[colorscheme];
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isWide = width >= 760;

    const {
        conversations,
        isLoading,
        currentProfile
    } = useConversations();

    const openConversation = (conversationId: number) => {
        router.push({
            pathname: "/messages/[id]",
            params: { id: String(conversationId) }
        } as Href);
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header title={t("messages")} />
            {
                isLoading ?
                    <LoaderSkeleton />
                    :
                    <View style={[styles.inboxShell, isWide && styles.inboxShellWide]}>
                        <View style={[styles.listPane, isWide && { maxWidth: 460 }]}>
                            <FlatList
                                data={conversations}
                                keyExtractor={item => item.id.toString()}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.conversationList}
                                ListEmptyComponent={
                                    <NoDataFound
                                        iconName="chatbubbles-outline"
                                        message={t("message_no_conversations")}
                                    />
                                }
                                renderItem={({ item }) => (
                                    <ConversationItem
                                        conversation={item}
                                        currentUserId={currentProfile?.id || ""}
                                        onPress={() => openConversation(item.id)}
                                    />
                                )}
                            />
                        </View>
                        {isWide && (
                            <View style={[styles.emptyThreadPane, { backgroundColor: colors.gray200 }]}>
                                <Ionicons name="chatbubble-ellipses-outline" size={56} color={colors.icon} />
                                <Text style={[styles.emptyThreadTitle, { color: colors.text }]}>
                                    {t("message_select_conversation")}
                                </Text>
                            </View>
                        )}
                    </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 48,
        gap: 18
    },
    inboxShell: {
        flex: 1
    },
    inboxShellWide: {
        flexDirection: "row",
        gap: 16
    },
    listPane: {
        flex: 1
    },
    conversationList: {
        gap: 10,
        paddingBottom: 24,
        flexGrow: 1
    },
    conversationItem: {
        minHeight: 76,
        borderRadius: 8,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    avatar: {
        overflow: "hidden"
    },
    avatarFallback: {
        alignItems: "center",
        justifyContent: "center"
    },
    avatarText: {
        fontSize: 16,
        fontWeight: "700"
    },
    conversationBody: {
        flex: 1,
        gap: 6,
        minWidth: 0
    },
    conversationTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8
    },
    conversationName: {
        flex: 1,
        fontSize: 16,
        fontWeight: "700"
    },
    conversationTime: {
        fontSize: 12,
        fontWeight: "600"
    },
    lastMessage: {
        fontSize: 14
    },
    emptyThreadPane: {
        flex: 1,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24
    },
    emptyThreadTitle: {
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center"
    },
    pressed: {
        opacity: 0.72
    }
})

export default MessageScreen;