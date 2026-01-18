import { createProfile } from "@/actions/profile.action";
import { createUser } from "@/actions/user.action";
import { webBaseUrl } from "@/config";
import { Colors } from "@/constants/Colors";
import { RegisterType } from "@/types/signUp";
import * as Linking from "expo-linking";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input/react-native-input";
import Button from "./ui/button";
import Icons from "./ui/icons";
import Loading from "./ui/loading";

const SignUpForm = () => {
    const colorScheme = useColorScheme() || "light";
    const { t } = useTranslation();
    const [isPending, setIsPending] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        reset
    } = useForm<RegisterType>();

    const handleShowPassword = () => setShowPassword(prev => !prev);

    const onSubmit = async (data: RegisterType) => {
        try {
            setIsPending(true);

            const {
                fullName,
                emailAddress,
                password,
                phoneNumber
            } = data;

            const user = await createUser(emailAddress, password);
            if (!user) return;

            const profile = await createProfile({
                id: user.id,
                roles: ["driver"],
                fullName,
                emailAddress,
                phoneNumber,
            })

            if (!profile) return;

            setIsSaved(true);
            reset();
        } catch (err) {
            setIsSaved(false);
        } finally {
            setIsPending(false);
        }
    }

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={80}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.contentInfo}>
                        <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                            {t("full_name")} *
                        </Text>
                        <View style={styles.inputContent}>
                            <Controller
                                control={control}
                                name="fullName"
                                rules={{ required: t("this_field_is_required") as string }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        placeholder={t("your") + " " + t("full_name").toLowerCase()}
                                        style={[
                                            styles.input,
                                            {
                                                color: Colors[colorScheme].text,
                                                borderColor: Colors[colorScheme].tint,
                                            }
                                        ]}
                                        placeholderTextColor={Colors[colorScheme].text}
                                    />
                                )}
                            />
                            {
                                errors.fullName &&
                                <Text style={styles.inputError}>{errors.fullName.message}</Text>
                            }
                        </View>

                        <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                            {t("phone_number")} *
                        </Text>
                        <View style={styles.inputContent}>
                            <Controller
                                control={control}
                                name="phoneNumber"
                                rules={{
                                    required: t("this_field_is_required") as string,
                                    validate: (curr: string) =>
                                        isValidPhoneNumber(curr) || t("invalid_number")
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <PhoneInput
                                        value={value}
                                        onChange={onChange}
                                        style={[
                                            styles.input,
                                            {
                                                color: Colors[colorScheme].text,
                                                borderColor: Colors[colorScheme].tint,
                                            }
                                        ]}
                                        placeholder={t("your") + " " + t("phone_number").toLowerCase()}
                                        placeholderTextColor={Colors[colorScheme].text}
                                    />
                                )}
                            />
                            {
                                errors.phoneNumber &&
                                <Text style={styles.inputError}>{errors.phoneNumber.message}</Text>
                            }
                        </View>

                        <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                            {t("email_address")} *
                        </Text>
                        <View style={styles.inputContent}>
                            <Controller
                                control={control}
                                name="emailAddress"
                                rules={{
                                    required: t("this_field_is_required") as string,
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: t("invalid_email_address")
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        value={value}
                                        onChangeText={onChange}
                                        placeholder={t("your") + " " + t("email_address").toLowerCase()}
                                        style={[
                                            styles.input,
                                            {
                                                color: Colors[colorScheme].text,
                                                borderColor: Colors[colorScheme].tint,
                                            }
                                        ]}
                                        placeholderTextColor={Colors[colorScheme].text}
                                    />
                                )}
                            />
                            {
                                errors.emailAddress &&
                                <Text style={styles.inputError}>{errors.emailAddress.message}</Text>
                            }
                        </View>

                        <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                            {t("password")} *
                        </Text>
                        <View style={styles.inputContent}>
                            <View style={[styles.inputPassword, { borderColor: Colors[colorScheme].tint }]}>
                                <Controller
                                    control={control}
                                    name="password"
                                    rules={{ required: t("this_field_is_required") as string }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder={t("input_your_password")}
                                            style={{
                                                color: Colors[colorScheme].text,
                                                borderColor: Colors[colorScheme].tint,
                                                flex: 1
                                            }}
                                            placeholderTextColor={Colors[colorScheme].text}
                                            secureTextEntry={!showPassword}
                                        />
                                    )}
                                />
                                <Icons
                                    name={showPassword ? "eye" : "eye-off"}
                                    onPress={handleShowPassword}
                                    size={20}
                                    color="grey"
                                />
                            </View>
                            {
                                errors.password &&
                                <Text style={styles.inputError}>{errors.password.message}</Text>
                            }
                        </View>

                        <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                            {t("confirm_password")} *
                        </Text>
                        <View style={styles.inputContent}>
                            <View style={[styles.inputPassword, { borderColor: Colors[colorScheme].tint }]}>
                                <Controller
                                    control={control}
                                    name="confirmPassword"
                                    rules={{
                                        required: t("this_field_is_required") as string,
                                        validate: curr =>
                                            watch("password") === curr || t("password_do_not_match")
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            value={value}
                                            onChangeText={onChange}
                                            placeholder={t("confirm_your_password_here")}
                                            style={{
                                                color: Colors[colorScheme].text,
                                                borderColor: Colors[colorScheme].tint,
                                                flex: 1
                                            }}
                                            placeholderTextColor={Colors[colorScheme].text}
                                            secureTextEntry={!showPassword}
                                        />
                                    )}
                                />
                                <Icons
                                    name={showPassword ? "eye" : "eye-off"}
                                    onPress={handleShowPassword}
                                    size={20}
                                    color="grey"
                                />
                            </View>
                            {
                                errors.confirmPassword &&
                                <Text style={styles.inputError}>{errors.confirmPassword.message}</Text>
                            }
                        </View>
                    </View>
                    {
                        isSaved &&
                        <Text 
                            style={[
                                styles.textSaved,
                                {
                                    color: "#c70000ff"
                                }
                            ]}
                        >
                            {t("check_email_verify_account")}
                        </Text>
                    }
                </ScrollView>
            </KeyboardAvoidingView>

            <View
                style={{
                    gap: 10
                }}
            >
                <Button title={t("sign_up")} onPress={handleSubmit(onSubmit)} />
                <Pressable
                    style={({ pressed }) => pressed ? {
                            opacity: 0.7
                        } : {}
                    }
                    onPress={() => Linking.openURL(`${webBaseUrl}`)}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorScheme].tint,
                            textAlign: "right"
                        }}
                    >
                        {t("want_to_have_your_own_parking")}
                    </Text>
                </Pressable>
            </View>

            {isPending && <Loading />}
        </>
    )
}

const styles = StyleSheet.create({
    contentInfo: {
        gap: 10,
        paddingBottom: 15
    },
    inputContent: {
        gap: 5
    },
    inputPassword: {
        paddingHorizontal: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 5
    },
    inputSelect: {
        backgroundColor: "transparent",
        minHeight: 40,
        borderRadius: 5
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5
    },
    inputError: {
        fontSize: 14,
        color: "#ff0000"
    },
    textSaved: {
        fontSize: 16
    }
})

export default SignUpForm;
