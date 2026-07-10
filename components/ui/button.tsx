import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, useColorScheme } from "react-native";

interface ButtonProps {
    title: string;
    onPress: ([...agrs]: any) => void;
    disabled?: boolean;
}

const Button = ({
    title,
    onPress,
    disabled
}: ButtonProps) => {
    const colorscheme = useColorScheme() || "light";
    const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        setColorScheme(colorscheme);
    }, [colorscheme])

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: Colors[colorScheme].tint
                },
                pressed ? styles.pressed : null,
                disabled ? styles.pressed : null
            ]}
        >
            <Text style={
                [
                    styles.buttonText,
                    {
                        color: Colors[colorScheme].background
                    }
                ]
            }
            >
                {title}
            </Text>
        </Pressable>
    )
}

const minWidth = Dimensions.get("window").width * 0.8;

const styles = StyleSheet.create({
    button: {
        minWidth,
        paddingVertical: 12,
        borderRadius: 8
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    pressed: {
        opacity: 0.75
    }
})

export default Button;