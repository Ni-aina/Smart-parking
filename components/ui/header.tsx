import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { ReactNode } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

interface HeaderInterface {
    title: string;
    rightIcon?: ReactNode;
}

const Header = ({
    title,
    rightIcon
}: HeaderInterface) => {
    const colorscheme = useColorScheme() || "light";
    const router = useRouter();

    return (
        <View style={styles.headerContent}>
            <Pressable
                style={({ pressed }) => [
                    {
                        justifyContent: "center",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: Colors[colorscheme].icon,
                        borderRadius: 50,
                        padding: 2
                    },
                    pressed && { opacity: 0.7 }
                ]}
                onPress={() => router.canGoBack() && router.back()}
            >
                <Ionicons
                    name="arrow-back"
                    size={24}
                    color={Colors[colorscheme].text}
                />
            </Pressable>
            <Text
                style={{
                    fontSize: 20,
                    fontWeight: "600",
                    color: Colors[colorscheme].text
                }}
            >
                {title}
            </Text>
            <View>
                {rightIcon}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
        gap: 20
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
})

export default Header;