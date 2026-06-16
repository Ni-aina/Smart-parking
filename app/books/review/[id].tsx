import { upsertReview } from "@/actions/review.action";
import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import { Colors } from "@/constants/Colors";
import useMyReview from "@/hooks/reviews/useMyReview";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Keyboard,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    useColorScheme,
    View
} from "react-native";

const ReviewScreen = () => {

    const { t } = useTranslation();
    const colorScheme = useColorScheme() || "light";
    const { id } = useLocalSearchParams<{ id: string }>();
    const lotId = Number(id);
    const router = useRouter();
    const queryClient = useQueryClient();
    const { currentProfile } = useCurrentProfile();
    const { myReview, isLoading } = useMyReview({ lotId });

    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        if (!myReview) return;
        setRating(myReview.rating);
        setFeedback(myReview.feedback ?? "");
    }, [myReview])

    const handleSubmit = async () => {
        if (rating === 0 || !currentProfile) return;

        setIsPending(true);

        try {
            await upsertReview({
                lotId,
                userId: currentProfile.id,
                rating,
                feedback: feedback.trim()
            })
            queryClient.invalidateQueries({ queryKey: ["my-review", lotId] });
            queryClient.invalidateQueries({ queryKey: ["reviews", lotId] });
            router.back();
        } finally {
            setIsPending(false);
        }
    }

    const inactiveColor = Colors[colorScheme].icon;

    const ratingLabels: Record<number, string> = {
        1: t("review_rating_1"),
        2: t("review_rating_2"),
        3: t("review_rating_3"),
        4: t("review_rating_4"),
        5: t("review_rating_5")
    }

    const displayRating = hoveredRating || rating;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
                <Header title={t("write_a_review")} />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={[styles.card, { backgroundColor: Colors[colorScheme].gray100 }]}>
                        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
                            {t("your_rating")}
                        </Text>
                        <Text style={[styles.ratingLabel, { color: Colors[colorScheme].icon }]}>
                            {displayRating > 0 ? ratingLabels[displayRating] : t("review_tap_to_rate")}
                        </Text>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((star) =>
                                <Pressable
                                    key={star}
                                    onPress={() => setRating(star)}
                                    onPressIn={() => setHoveredRating(star)}
                                    onPressOut={() => setHoveredRating(0)}
                                    style={styles.starButton}
                                >
                                    <Ionicons
                                        name={star <= displayRating ? "star" : "star-outline"}
                                        size={40}
                                        color={star <= displayRating ? "#ffbf00" : inactiveColor}
                                    />
                                </Pressable>
                            )}
                        </View>
                    </View>
                    <View style={[styles.card, { backgroundColor: Colors[colorScheme].gray100 }]}>
                        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>
                            {t("your_feedback")}
                        </Text>
                        <TextInput
                            value={feedback}
                            onChangeText={setFeedback}
                            placeholder={t("review_feedback_placeholder")}
                            placeholderTextColor={Colors[colorScheme].icon}
                            multiline
                            numberOfLines={6}
                            maxLength={500}
                            textAlignVertical="top"
                            style={[
                                styles.textArea,
                                {
                                    color: Colors[colorScheme].text,
                                    borderColor: Colors[colorScheme].gray200,
                                    backgroundColor: Colors[colorScheme].background
                                }
                            ]}
                        />
                        <Text style={[styles.charCount, { color: Colors[colorScheme].icon }]}>
                            {feedback.length} / 500
                        </Text>
                    </View>
                </ScrollView>
                <Button
                    title={isPending ? t("submitting") : t("submit_review")}
                    onPress={handleSubmit}
                    disabled={rating === 0 || isPending || isLoading}
                />
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40
    },
    scrollContent: {
        gap: 16,
        paddingVertical: 20,
        paddingBottom: 40
    },
    card: {
        borderRadius: 12,
        padding: 20,
        gap: 12
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600"
    },
    ratingLabel: {
        fontSize: 14,
        textAlign: "center"
    },
    starsRow: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 8
    },
    starButton: {
        padding: 4
    },
    textArea: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        minHeight: 130
    },
    charCount: {
        fontSize: 12,
        textAlign: "right"
    }
})

export default ReviewScreen;