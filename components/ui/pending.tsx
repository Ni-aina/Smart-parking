import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, useColorScheme, View } from "react-native";
import Icons from "./icons";

const Pending = () => {
    const rotateValue = useRef(new Animated.Value(0)).current;
    const colorSchema = useColorScheme() || "light";

    const spin = rotateValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    })

    useEffect(() => {
        const startRotation = () => {
            rotateValue.setValue(0);
            Animated.loop(
                Animated.timing(rotateValue, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.linear,
                    useNativeDriver: true
                })
            ).start()
        }
        startRotation();
    }, [rotateValue])

    return (
        <View style={styles.overlay}>
            <Animated.View
                style={{
                    transform: [{ rotate: spin }]
                }}
            >
                <Icons name="reload-circle" size={48} color={
                    colorSchema === "light" ?
                        "rgba(0,0,0,0.2)" :
                        "rgba(255,255,255,0.3)"
                } />
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    }
})

export default Pending;