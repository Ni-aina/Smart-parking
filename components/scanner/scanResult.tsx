import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

type ScanStatus = "valid" | "expired" | "not_found";

interface ScanResultProps {
    status: ScanStatus;
    message?: string;
}

const statusConfig: Record<ScanStatus, {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    backgroundColor: string;
}> = {
    valid: {
        icon: "checkmark-circle",
        color: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)"
    },
    expired: {
        icon: "time",
        color: "#f59e0b",
        backgroundColor: "rgba(245, 158, 11, 0.1)"
    },
    not_found: {
        icon: "close-circle",
        color: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)"
    }
}

const ScanResult = ({
    status,
    message
}: ScanResultProps) => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() || "light";
    const config = statusConfig[status];

    const titleKeys: Record<ScanStatus, string> = {
        valid: t("scan_valid_title"),
        expired: t("scan_expired_title"),
        not_found: t("scan_not_found_title")
    }

    const messageKeys: Record<ScanStatus, string> = {
        valid: t("scan_valid_message"),
        expired: t("scan_expired_message"),
        not_found: t("scan_not_found_message")
    }

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.iconWrapper,
                    { backgroundColor: config.backgroundColor }
                ]}
            >
                <Ionicons
                    name={config.icon}
                    size={80}
                    color={config.color}
                />
            </View>
            <Text
                style={[
                    styles.title,
                    { color: Colors[colorScheme].text }
                ]}
            >
                {titleKeys[status]}
            </Text>
            <Text
                style={[
                    styles.message,
                    { color: Colors[colorScheme].icon }
                ]}
            >
                {message ?? messageKeys[status]}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
        gap: 12
    },
    iconWrapper: {
        width: 130,
        height: 130,
        borderRadius: 65,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center"
    },
    message: {
        fontSize: 16,
        textAlign: "center",
        maxWidth: "85%",
        lineHeight: 22
    }
})

export default ScanResult;
