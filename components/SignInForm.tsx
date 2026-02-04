import { login } from "@/actions/user.action";
import { Colors } from "@/constants/Colors";
import { LoginType } from "@/types/signIn";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";
import Button from "./ui/button";
import ErrorModal from "./ui/errorModal";
import Icons from "./ui/icons";
import Loading from "./ui/loading";

const SignInForm = () => {
    const colorScheme = useColorScheme() || "light";
    const { t } = useTranslation();
    const [isPending, setIsPending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [signInError, setSignInError] = useState("");

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<LoginType>();

    const handleShowPassword = () => setShowPassword(prev => !prev);

    const onSubmit = async (data: LoginType) => {
        const { email, password } = data;
        try {
            setIsPending(true);
            await login(email, password);
            reset();
        } catch {
            setSignInError(t("failed_authentication"));
        } finally {
            setIsPending(false);
        }
    }

    useEffect(() => {
        if (!signInError) return;

        const errorTimedOut = setTimeout(() => {
            setSignInError("")
        }, 2000)

        return () => {
            clearTimeout(errorTimedOut)
        }
    }, [signInError])

    return (
        <>
            <View style={styles.contentInfo}>
                <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                    {t("email")} *
                </Text>
                <View style={styles.inputContent}>
                    <Controller
                        control={control}
                        name="email"
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
                                placeholder="example@email.com"
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
                        errors.email &&
                        <Text style={styles.inputError}>{errors.email.message}</Text>
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
            </View>
            <Button title={t("sign_in")} onPress={handleSubmit(onSubmit)} />

            {isPending && <Loading />}

            <ErrorModal
                visible={!!signInError}
                title={t("error_sign_in")}
                message={signInError}
                onClose={
                    () => setSignInError("")
                }
            />
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
    input: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5
    },
    inputError: {
        fontSize: 14,
        color: "#ff0000"
    }
})

export default SignInForm;