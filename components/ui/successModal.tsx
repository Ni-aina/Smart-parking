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

interface SuccessModalProps {
    visible: boolean;
    title?: string;
    message?: string;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
    visible,
    title,
    message,
    onClose
}) => {
    const { t } = useTranslation()
    const colorScheme = useColorScheme() || "light";
    const modalTitle = title ?? t("success_title");
    const modalMessage = message ?? t("operation_successful");

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
        color: "rgb(72, 175, 72)"
    }
})

export default SuccessModal;