import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet } from "react-native";

interface IconsProps {
    name: keyof typeof Ionicons.glyphMap,
    size?: number,
    color?: string,
    style?: object,
    onPress?: ([...args]: any) => void,
    disable?: boolean
}

const Icons = ({
    name,
    size,
    color,
    style,
    onPress,
    disable
}: IconsProps) => {

    return (
        <Pressable
            style={({ pressed }) => [styles.icon, pressed && styles.pressed]}
            onPress={onPress}
            disabled={disable}
        >
            <Ionicons name={name} size={size || 24} color={color} style={style} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    pressed: {
        opacity: 0.7
    },
    icon: {
        padding: 5
    }
})

export default Icons;