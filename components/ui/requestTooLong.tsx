import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

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
        <View style={styles.container}>
            <Pressable
                style={({ pressed }) => [
                    styles.itemContent,
                    pressed && styles.pressed
                ]}
                onPress={refresh}
            >
                <Ionicons
                    name="refresh-outline"
                    size={18}
                    color={Colors[colorscheme].text}
                />
                <Text
                    style={{
                        fontSize: 18,
                        color: Colors[colorscheme].text
                    }}
                >
                    {message}
                </Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "center",
        alignItems: "center",
    },
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