import { Colors } from "@/constants/Colors";
import { Dimensions, Pressable, StyleSheet, Text } from "react-native";

interface ButtonProps {
    title: string;
    onPress: ([...agrs]: any) => void;
}

const Button = ({ title, onPress }: ButtonProps) => {

    return (
        <Pressable
            onPress={onPress}
            android_ripple={{
                color: '#00000020'
            }}
            style={({ pressed }) => [
                styles.button,
                pressed ? styles.pressed : null
            ]}
        >
            <Text style={styles.buttonText}>
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
        backgroundColor: Colors["light"].tint,
        borderRadius: 8
    },
    buttonText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold'
    },
    pressed: {
        opacity: 0.75
    }
})

export default Button;