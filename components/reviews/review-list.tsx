import { deleteReview } from "@/actions/review.action";
import { Colors } from "@/constants/Colors";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { ReviewInterface } from "@/types/review";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "moti";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

interface Props {
    lotId: string;
    reviews: ReviewInterface[];
    isLoading: boolean;
}

const ReviewList = ({
    lotId,
    reviews,
    isLoading
}: Props) => {

    const { t } = useTranslation();
    const colorScheme = useColorScheme() || "light";
    const { currentProfile } = useCurrentProfile();
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        setDeletingId(id);
        try {
            await deleteReview(id);
            queryClient.invalidateQueries({ queryKey: ["reviews", lotId] });
            queryClient.invalidateQueries({ queryKey: ["my-review", lotId] });
        } finally {
            setDeletingId(null);
        }
    }

    if (isLoading || reviews.length === 0) return null;

    return (
        <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) =>
                <View style={[styles.card, { backgroundColor: Colors[colorScheme].gray200 }]}>
                    <View style={styles.cardHeader}>
                        <View style={styles.userRow}>
                            {
                                item.urlImage ?
                                    <Image
                                        source={{ uri: item.urlImage }}
                                        style={styles.avatar}
                                    />
                                    :
                                    <View style={[styles.avatar, styles.avatarFallback, { backgroundColor: Colors[colorScheme].text }]}>
                                        <Text style={[styles.avatarInitial, { color: Colors[colorScheme].background }]}>
                                            {item.fullName?.at(0)?.toUpperCase()}
                                        </Text>
                                    </View>
                            }
                            <View style={styles.userInfo}>
                                <Text style={[styles.fullName, { color: Colors[colorScheme].text }]}>
                                    {item.fullName ?? t("default_user")}
                                </Text>
                                <View style={styles.starsRow}>
                                    {[1, 2, 3, 4, 5].map((star) =>
                                        <Ionicons
                                            key={star}
                                            name={star <= item.rating ? "star" : "star-outline"}
                                            size={14}
                                            color={star <= item.rating ? "#ffbf00" : Colors[colorScheme].icon}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                        <View style={styles.rightColumn}>
                            <Text style={[styles.date, { color: Colors[colorScheme].icon }]}>
                                {new Date(item.createdAt).toLocaleDateString()}
                            </Text>
                            {
                                item.userId === currentProfile?.id &&
                                <Pressable
                                    onPress={() => handleDelete(item.id)}
                                    disabled={deletingId === item.id}
                                    style={({ pressed }) => pressed ? [
                                        styles.deleteButton,
                                        { opacity: 0.5 }
                                    ] :
                                        styles.deleteButton
                                    }
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={16}
                                        color="#ff4444"
                                    />
                                </Pressable>
                            }
                        </View>
                    </View>
                    {
                        item.feedback &&
                        <Text style={[styles.feedback, { color: Colors[colorScheme].text }]}>
                            {item.feedback}
                        </Text>
                    }
                </View>
            }
        />
    )
}

const styles = StyleSheet.create({
    list: {
        gap: 12
    },
    card: {
        borderRadius: 12,
        padding: 16,
        gap: 8
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 100
    },
    avatarFallback: {
        justifyContent: "center",
        alignItems: "center"
    },
    avatarInitial: {
        fontSize: 16,
        fontWeight: "600"
    },
    userInfo: {
        gap: 4
    },
    fullName: {
        fontSize: 14,
        fontWeight: "600"
    },
    starsRow: {
        flexDirection: "row",
        gap: 3
    },
    rightColumn: {
        alignItems: "flex-end",
        gap: 6
    },
    date: {
        fontSize: 12
    },
    deleteButton: {
        padding: 4
    },
    feedback: {
        fontSize: 14,
        lineHeight: 20
    }
})

export default ReviewList;