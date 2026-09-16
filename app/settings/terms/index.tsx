import Header from "@/components/ui/header"
import { Colors } from "@/constants/Colors"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useTranslation } from "react-i18next"
import { ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native"

const TermsAndConditions = () => {
    const { t } = useTranslation()
    const colorScheme = useColorScheme() === "dark" ? "dark" : "light"

    const sections = [
        { title: "terms_use_title", description: "terms_use_description" },
        { title: "terms_reservations_title", description: "terms_reservations_description" },
        { title: "terms_payments_title", description: "terms_payments_description" },
        { title: "terms_responsibilities_title", description: "terms_responsibilities_description" }
    ]

    return (
        <View style={styles.container}>
            <Header title={t("term_and_condition")} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <View style={[styles.iconCircle, { backgroundColor: Colors[colorScheme].text }]}>
                        <Ionicons name="document-text-outline" size={36} color={Colors[colorScheme].background} />
                    </View>
                    <Text style={[styles.title, { color: Colors[colorScheme].text }]}>{t("terms_title")}</Text>
                    <Text style={[styles.description, { color: Colors[colorScheme].icon }]}>{t("terms_description")}</Text>
                </View>

                {sections.map((section) => (
                    <View key={section.title} style={[styles.card, { backgroundColor: Colors[colorScheme].background }]}>
                        <Text style={[styles.cardTitle, { color: Colors[colorScheme].text }]}>{t(section.title)}</Text>
                        <Text style={[styles.body, { color: Colors[colorScheme].icon }]}>{t(section.description)}</Text>
                    </View>
                ))}
            </ScrollView>
            <Text style={[styles.updatedAt, { color: Colors[colorScheme].icon }]}>{t("terms_last_updated")}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 40,
        gap: 20
    },
    content: {
        paddingTop: 34,
        paddingBottom: 36,
        gap: 16
    },
    hero: {
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 16,
        marginBottom: 10
    },
    iconCircle: {
        width: 82,
        height: 82,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8
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
    card: {
        borderRadius: 14,
        padding: 18,
        gap: 10
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "700"
    },
    body: {
        fontSize: 15,
        lineHeight: 23
    },
    updatedAt: {
        fontSize: 13,
        textAlign: "center",
        marginTop: 4
    }
})

export default TermsAndConditions
