import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";

type Props = {
    onPress: () => void;
}

const FabButton = ({ onPress }: Props) => {
    const colorscheme = useColorScheme() || "light";
    const colors = Colors[colorscheme];

    return (
        <TouchableOpacity
            style={[styles.fab, { backgroundColor: colors.tint }]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Ionicons
                name="chatbubble-ellipses"
                size={24}
                color={colors.background}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    fab: {
        width: 40,
        height: 40,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5
    }
})

export default FabButton;