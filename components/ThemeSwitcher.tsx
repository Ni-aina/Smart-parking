import { Colors } from "@/constants/Colors";
import { useTheme } from "@/stores/context/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet, useColorScheme, View } from "react-native";

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();

    const colorscheme = useColorScheme() ?? "light";

    const anim = useRef(
        new Animated.Value(
            theme === "system" ? 0 : theme === "light" ? 1 : 2
        )
    ).current

    useEffect(() => {
        Animated.timing(anim, {
            toValue: theme === "system" ? 0 : theme === "light" ? 1 : 2,
            duration: 220,
            useNativeDriver: false
        }).start()
    }, [theme])

    const cycleTheme = () => {
        const next =
            theme === "system"
                ? "light"
                : theme === "light"
                    ? "dark"
                    : "system"

        setTheme(next)
    }

    const translateX = anim.interpolate({
        inputRange: [0, 1, 2],
        outputRange: [3, 25, 46]
    })

    return (
        <Pressable onPress={cycleTheme} style={styles.wrap}>
            <View style={[
                styles.track,
                { backgroundColor: Colors[colorscheme].icon + "22" }
            ]}>
                <Animated.View
                    style={[
                        styles.thumb,
                        {
                            transform: [{ translateX }],
                            backgroundColor: Colors[colorscheme].gray100
                        }
                    ]}
                />

                <View style={styles.icons}>
                    <Ionicons
                        name="phone-portrait-outline"
                        size={14}
                        color={Colors[colorscheme].text}
                    />
                    <Ionicons
                        name="sunny-outline"
                        size={14}
                        color={Colors[colorscheme].text}
                    />
                    <Ionicons
                        name="moon-outline"
                        size={14}
                        color={Colors[colorscheme].text}
                    />
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    wrap: {
        marginLeft: "auto"
    },
    track: {
        width: 70,
        height: 28,
        borderRadius: 20,
        justifyContent: "center",
        paddingHorizontal: 6
    },
    thumb: {
        position: "absolute",
        width: 20,
        height: 20,
        borderRadius: 10
    },
    icons: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})

export default ThemeSwitcher;