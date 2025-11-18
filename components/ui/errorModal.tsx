import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect } from "react";
import {
    Modal,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";
import Icons from './icons';

interface ErrorModalProps {
    visible: boolean;
    title?: string;
    message?: string;
    onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
    visible,
    title = "Error!",
    message = "Something went wrong.",
    onClose
}) => {
    const colorScheme = useColorScheme() || "light";

    useEffect(() => {
        NavigationBar.setVisibilityAsync("hidden");
    }, [])

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
        >
            <StatusBar
                barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
                backgroundColor="rgba(0,0,0,0.1)"
            />
            <View style={styles.overlay}>
                <View style={[
                    styles.content,
                    {
                        backgroundColor: colorScheme === "dark" ?
                            "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"
                    }
                ]}>
                    <View
                        style={styles.container}
                    >
                        <Text
                            style={
                                [
                                    styles.title,
                                    {
                                        color: "#777"
                                    }
                                ]
                            }
                        >{title}</Text>
                        <Text
                            style={
                                [
                                    styles.message,
                                    { color: "#b65353ff" }
                                ]
                            }
                        >{message}</Text>
                    </View>
                    <Icons
                        name="close"
                        color="#777"
                        size={24}
                        onPress={onClose}
                        style={{
                            marginTop: -5,
                            marginEnd: -5
                        }}
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "#00000014",
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        width: "80%",
        flexDirection: "row",
        borderRadius: 10,
        padding: 15,
        gap: 5
    },
    container: {
        flex: 1
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10
    },
    message: {
        fontSize: 16,
        marginBottom: 20
    }
})

export default ErrorModal;
