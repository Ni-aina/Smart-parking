import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

type Props = {
    onClose: () => void;
}

const ChatHeader = ({ onClose }: Props) => {
    const { t } = useTranslation();
    const colorscheme = useColorScheme() || "light";
    const colors = Colors[colorscheme];

    return (
        <View style={[styles.header, { backgroundColor: colors.tint }]}>
            <View style={styles.left}>
                <View style={[styles.dot, { backgroundColor: colors.background }]} />
                <Text style={[styles.title, { color: colors.background }]}>{t("chat_support")}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={20} color={colors.background} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    left: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4
    },
    title: {
        fontWeight: "500",
        fontSize: 14
    }
})

export default ChatHeader;