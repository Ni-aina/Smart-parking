import Header from "@/components/ui/header";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

const APP_VERSION = "1.0.0";

const AboutApp = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() === "dark" ? "dark" : "light";

    const features = [
        { icon: "search-outline" as const, text: "about_feature_find" },
        { icon: "calendar-outline" as const, text: "about_feature_reserve" },
        { icon: "card-outline" as const, text: "about_feature_pay" },
        { icon: "navigate-outline" as const, text: "about_feature_manage" }
    ]

    return (
        <View style={styles.container}>
            <Header title={t("about_app")} />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.hero}>
                    <View style={[styles.appIcon, { backgroundColor: Colors[colorScheme].text }]}>
                        <Ionicons name="car-sport" size={38} color={Colors[colorScheme].background} />
                    </View>
                    <Text style={[styles.appName, { color: Colors[colorScheme].text }]}>{t("about_app_name")}</Text>
                    <Text style={[styles.version, { color: Colors[colorScheme].icon }]}>{t("app_version", { version: APP_VERSION })}</Text>
                </View>

                <View style={[styles.card, { backgroundColor: Colors[colorScheme].background }]}>
                    <Text style={[styles.cardTitle, { color: Colors[colorScheme].text }]}>{t("about_app_title")}</Text>
                    <Text style={[styles.body, { color: Colors[colorScheme].icon }]}>{t("about_app_description")}</Text>
                </View>

                <View style={[styles.card, { backgroundColor: Colors[colorScheme].background }]}>
                    <Text style={[styles.cardTitle, { color: Colors[colorScheme].text }]}>{t("about_features_title")}</Text>
                    <View style={styles.features}>
                        {features.map((feature) => (
                            <View key={feature.text} style={styles.feature}>
                                <Ionicons name={feature.icon} size={20} color={Colors[colorScheme].text} />
                                <Text style={[styles.featureText, { color: Colors[colorScheme].icon }]}>{t(feature.text)}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            <Text style={[styles.copyright, { color: Colors[colorScheme].icon }]}>{t("about_copyright")}</Text>
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
        gap: 6,
        marginBottom: 10
    },
    appIcon: {
        width: 82,
        height: 82,
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8
    },
    appName: {
        fontSize: 24,
        fontWeight: "700"
    },
    version: {
        fontSize: 14
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
    features: {
        gap: 14,
        marginTop: 2
    },
    feature: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12
    },
    featureText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 21
    },
    copyright: {
        fontSize: 13,
        textAlign: "center",
        marginTop: 4
    }
})

export default AboutApp;
