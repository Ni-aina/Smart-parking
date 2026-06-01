import { Colors } from "@/constants/Colors";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, useColorScheme, View } from "react-native";
import Icons from "./icons";

interface PasswordProps {
    value?: string;
    onChangeText?: (text: string) => void;
    placeholder?: string;
    secure?: boolean;
    inputStyle?: any;
}

const PasswordInput = ({
    value,
    onChangeText,
    placeholder,
    secure = true,
    inputStyle
}: PasswordProps) => {
    const colorScheme = useColorScheme() || "light";
    const { t } = useTranslation();
    const [show, setShow] = useState(false);

    return (
        <View style={[styles.inputPassword, { borderColor: Colors[colorScheme].tint }]}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder || t("input_your_password")}
                placeholderTextColor={Colors[colorScheme].text}
                secureTextEntry={secure && !show}
                style={[{ color: Colors[colorScheme].text, flex: 1 }, inputStyle]}
            />
            <Icons
                name={show ? "eye" : "eye-off"}
                onPress={() => setShow(prev => !prev)}
                size={20}
                color="grey"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputPassword: {
        paddingHorizontal: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 5
    }
})

export default PasswordInput;
