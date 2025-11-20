import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";

interface RequestTooLongInterface {
    refresh: () => void;
    message: string;
}

const RequestTooLong = ({
    refresh,
    message
}: RequestTooLongInterface) => {
    const colorscheme = useColorScheme() || "light";

    return (
        <Pressable
            style={({ pressed }) => [
                styles.itemContent,
                pressed && styles.pressed
            ]}
            onPress={refresh}
        >
            <Ionicons
                name="refresh-outline"
                size={16}
                color={Colors[colorscheme].text}
            />
            <Text
                style={{
                    fontSize: 16,
                    color: Colors[colorscheme].text
                }}
            >
                {message}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    itemContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    pressed: {
        opacity: 0.7
    }
})

export default RequestTooLong;