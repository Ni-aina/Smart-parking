import {
    ActivityIndicator,
    StyleSheet,
    View
} from "react-native";

const Loading = () => (
    <View style={styles.overlay}>
        <ActivityIndicator
            size={40}
            color="#687076"
        />
    </View>
)

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.3)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    }
})

export default Loading;