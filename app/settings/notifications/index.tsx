import Header from "@/components/ui/header";
import { Colors } from "@/constants/Colors";
import { useNotificationContext } from "@/stores/context/NotificationContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch, Text, useColorScheme, View } from "react-native";

const NotificationSettings = () => {
    const { t } = useTranslation()
    const colorScheme = useColorScheme() === "dark" ? "dark" : "light"
    const colors = Colors[colorScheme]

    const {
        isAppUpdatesEnabled,
        isMessagesEnabled,
        handleSwitchUpdateEnabled,
        handleSwitchMessageEnabled
    } = useNotificationContext()

    return (
        <View style={styles.container}>
            <Header title={t("notification_settings")} />
            <View style={styles.content}>
                <View style={styles.hero}>
                    <View style={[styles.iconCircle, { backgroundColor: colors.text }]}>
                        <Ionicons name="notifications-outline" size={34} color={colors.background} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>{t("notification_settings_title")}</Text>
                    <Text style={[styles.description, { color: colors.icon }]}>{t("notification_settings_description")}</Text>
                </View>
                <View style={[styles.settingsCard, { borderColor: colors.gray200 }]}>
                    <View style={styles.settingRow}>
                        <View style={styles.settingCopy}>
                            <Text style={[styles.settingTitle, { color: colors.text }]}>{t("app_updates")}</Text>
                            <Text style={[styles.settingDescription, { color: colors.icon }]}>{t("app_updates_description")}</Text>
                        </View>
                        <Switch
                            accessibilityLabel={t("app_updates")}
                            trackColor={{ false: colors.gray200, true: colors.gray200 }}
                            thumbColor={colors.text}
                            value={isAppUpdatesEnabled}
                            onValueChange={handleSwitchUpdateEnabled}
                        />
                    </View>
                    <View style={[styles.divider, { backgroundColor: colors.gray200 }]} />
                    <View style={styles.settingRow}>
                        <View style={styles.settingCopy}>
                            <Text style={[styles.settingTitle, { color: colors.text }]}>{t("message_notifications")}</Text>
                            <Text style={[styles.settingDescription, { color: colors.icon }]}>{t("message_notifications_description")}</Text>
                        </View>
                        <Switch
                            accessibilityLabel={t("message_notifications")}
                            trackColor={{ false: colors.gray200, true: colors.gray200 }}
                            thumbColor={colors.text}
                            value={isMessagesEnabled}
                            onValueChange={handleSwitchMessageEnabled}
                        />
                    </View>
                </View>
            </View>
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
        paddingTop: 40,
        gap: 32
    },
    hero: {
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 16
    },
    iconCircle: {
        width: 76,
        height: 76,
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
    settingsCard: {
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 16,
        paddingHorizontal: 18
    },
    settingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        paddingVertical: 20
    },
    settingCopy: {
        flex: 1,
        gap: 5
    },
    settingTitle: {
        fontSize: 17,
        fontWeight: "700"
    },
    settingDescription: {
        fontSize: 14,
        lineHeight: 20
    },
    divider: {
        height: StyleSheet.hairlineWidth
    }
})

export default NotificationSettings;
