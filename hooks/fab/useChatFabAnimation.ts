import { useRef, useState } from "react";
import { Animated } from "react-native";

const useChatFABAnimation = () => {
    const [isOpen, setIsOpen] = useState(true);
    const scaleAnim = useRef(new Animated.Value(0)).current;

    const open = () => {
        setIsOpen(true);
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 7,
            tension: 80,
            useNativeDriver: true
        }).start();
    }

    const close = () => {
        Animated.spring(scaleAnim, {
            toValue: 0,
            useNativeDriver: true
        }).start(() => setIsOpen(false));
    }

    const toggle = () => isOpen ? close() : open();

    return { isOpen, scaleAnim, toggle, close };
}

export default useChatFABAnimation;