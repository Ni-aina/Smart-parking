import Header from "@/components/ui/header";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

const HelpCenter = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

    const questions = [
        { question: "help_find_parking_question", answer: "help_find_parking_answer" },
        { question: "help_make_reservation_question", answer: "help_make_reservation_answer" },
        { question: "help_payment_question", answer: "help_payment_answer" },
        { question: "help_cancel_reservation_question", answer: "help_cancel_reservation_answer" }
    ]

    return (
        <View style={styles.container}>
            <Header title={t("help_center")} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <View style={[styles.iconCircle, { backgroundColor: Colors[colorScheme].background }]}>
                        <Ionicons name="help-buoy-outline" size={34} color={Colors[colorScheme].text} />
                    </View>
                    <Text style={[styles.title, { color: Colors[colorScheme].text }]}>{t("help_center_title")}</Text>
                    <Text style={[styles.description, { color: Colors[colorScheme].icon }]}>{t("help_center_description")}</Text>
                </View>

                <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>{t("frequently_asked_questions")}</Text>
                <View style={styles.questions}>
                    {questions.map((item, index) => {
                        const isExpanded = expandedQuestion === index;

                        return (
                            <Pressable
                                key={item.question}
                                accessibilityRole="button"
                                accessibilityState={{ expanded: isExpanded }}
                                onPress={() => setExpandedQuestion(isExpanded ? null : index)}
                                style={({ pressed }) => [
                                    styles.questionCard,
                                    { backgroundColor: Colors[colorScheme].background },
                                    pressed && styles.pressed
                                ]}
                            >
                                <View style={styles.questionRow}>
                                    <Text style={[styles.question, { color: Colors[colorScheme].text }]}>{t(item.question)}</Text>
                                    <Ionicons
                                        name={isExpanded ? "chevron-up" : "chevron-down"}
                                        size={20}
                                        color={Colors[colorScheme].icon}
                                    />
                                </View>
                                {isExpanded && <Text style={[styles.answer, { color: Colors[colorScheme].icon }]}>{t(item.answer)}</Text>}
                            </Pressable>
                        )
                    })}
                </View>

                <View style={[styles.supportCard, { borderColor: Colors[colorScheme].gray200 }]}>
                    <Ionicons name="chatbubble-ellipses-outline" size={26} color={Colors[colorScheme].text} />
                    <View style={styles.supportCopy}>
                        <Text style={[styles.supportTitle, { color: Colors[colorScheme].text }]}>{t("need_more_help")}</Text>
                        <Text style={[styles.supportDescription, { color: Colors[colorScheme].icon }]}>{t("help_contact_support_description")}</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40
    },
    content: {
        paddingTop: 28,
        paddingBottom: 36,
        gap: 20
    },
    hero: {
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 16
    },
    iconCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6
    },
    title: {
        fontSize: 23,
        fontWeight: "700",
        textAlign: "center"
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        textAlign: "center"
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginTop: 8
    },
    questions: {
        gap: 10
    },
    questionCard: {
        borderRadius: 12,
        padding: 16,
        gap: 12
    },
    questionRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12
    },
    question: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600"
    },
    answer: {
        fontSize: 14,
        lineHeight: 21
    },
    supportCard: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 12,
        padding: 16,
        gap: 14,
        marginTop: 4
    },
    supportCopy: {
        flex: 1,
        gap: 3
    },
    supportTitle: {
        fontSize: 16,
        fontWeight: "700"
    },
    supportDescription: {
        fontSize: 14,
        lineHeight: 20
    },
    pressed: {
        opacity: 0.75
    }
})

export default HelpCenter;
