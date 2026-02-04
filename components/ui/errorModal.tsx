import { Colors } from '@/constants/Colors';
import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
    title,
    message,
    onClose
}) => {
    const { t } = useTranslation()
    const colorScheme = useColorScheme() || "light";
    const modalTitle = title ?? t("error_title");
    const modalMessage = message ?? t("something_went_wrong");

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
                barStyle={colorScheme === "dark" ? "dark-content" : "light-content"}
                backgroundColor={Colors[colorScheme].background}
            />
            <View
                style={
                    [
                        styles.overlay,
                        {
                            backgroundColor: Colors[colorScheme].background
                        }
                    ]
                }
            >
                <View
                    style={
                        [
                            styles.content,
                            {
                                backgroundColor: Colors[colorScheme].gray100
                            }
                        ]
                    }
                >
                    <View
                        style={styles.container}
                    >
                        <Text
                            style={
                                [
                                    styles.title,
                                    {
                                        color: Colors[colorScheme].text
                                    }
                                ]
                            }
                        >
                            {modalTitle}
                        </Text>
                        <Text
                            style={styles.message}
                        >
                            {modalMessage}
                        </Text>
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
        marginBottom: 20,
        color: "rgb(215, 72, 72)"
    }
})

export default ErrorModal;
