import {
    ActivityIndicator,
    StyleSheet,
    useColorScheme,
    View
} from "react-native";

const Loading = () => {
    const isDark = useColorScheme() === "dark";

    return (
        <View
            style={[
                styles.overlay,
                {
                    backgroundColor: isDark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2)"
                }
            ]}
        >
            <ActivityIndicator
                size={40}
                color="#687076"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    }
})

export default Loading;