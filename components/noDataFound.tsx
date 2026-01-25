import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

interface NoDataFoundProps {
    message: string;
    iconName?: keyof typeof Ionicons.glyphMap;
}

const NoDataFound = ({ 
    message, 
    iconName = "archive-outline"
}: NoDataFoundProps) => {
    const colorscheme = useColorScheme() || "light";
    const colors = Colors[colorscheme];

    return (
        <View style={styles.container}>
            <Ionicons
                name={iconName}
                color={colors.tint}
                size={64}
            />
            <Text style={[styles.message, { color: colors.text }]}>
                {message}
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
        gap: 8
    },
    icon: {
        opacity: 0.5,
        marginBottom: 8
    },
    message: {
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
        maxWidth: "80%"
    }
})

export default NoDataFound;