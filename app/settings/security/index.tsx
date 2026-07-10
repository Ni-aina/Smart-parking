import Button from "@/components/ui/button";
import ErrorModal from "@/components/ui/errorModal";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import PasswordInput from "@/components/ui/passwordInput";
import { Colors } from "@/constants/Colors";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import useKeyboardVisible from "@/hooks/useKeyboardVisible";
import usePassword from "@/hooks/usePassword";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, StyleSheet, Text, useColorScheme, View } from "react-native";

interface SecurityInterface {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const Security = () => {
    const { currentProfile } = useCurrentProfile();
    const email = currentProfile?.emailAddress || "";

    const colorScheme = useColorScheme() || "light";
    const { t } = useTranslation();

    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<SecurityInterface>();
    const [savingError, setSavingError] = useState<string | null>(null);

    const { mutate, isPending, error, isSuccess } = usePassword();

    const onSubmit = (data: SecurityInterface) => {
        const { currentPassword, newPassword } = data;
        mutate({ email, currentPassword, newPassword });
    }

    const isKeyboardVisible = useKeyboardVisible();

    useEffect(() => {
        if (!savingError) return;

        const errorTimedOut = setTimeout(() => {
            setSavingError("")
        }, 2000)

        return () => {
            clearTimeout(errorTimedOut)
        }
    }, [savingError])

    useEffect(() => {
        if (error?.message) {
            setSavingError(error.message);
        }
        if (isSuccess) {
            router.push("/(tabs)/account");
        }
    }, [
        isSuccess,
        error?.message
    ])

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={isKeyboardVisible ? "padding" : undefined}
        >
            <View
                style={{
                    gap: 15
                }}
            >
                <View
                    style={{
                        marginBottom: 20
                    }}
                >
                    <Header
                        title={t("change_password")}
                    />
                </View>

                <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                    {t("current_password")} *
                </Text>
                <Controller
                    control={control}
                    name="currentPassword"
                    rules={{ required: t("this_field_is_required") as string }}
                    render={({ field: { onChange, value } }) => (
                        <PasswordInput value={value} onChangeText={onChange} placeholder={t("placeholder_current_password")} />
                    )}
                />
                {
                    errors.currentPassword &&
                    <Text style={styles.inputError}>{errors.currentPassword.message}</Text>
                }

                <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                    {t("new_password")} *
                </Text>
                <Controller
                    control={control}
                    name="newPassword"
                    rules={{ required: t("this_field_is_required") as string, minLength: { value: 6, message: t("password_min_length") } }}
                    render={({ field: { onChange, value } }) => (
                        <PasswordInput value={value} onChangeText={onChange} placeholder={t("placeholder_new_password")} />
                    )}
                />
                {
                    errors.newPassword &&
                    <Text style={styles.inputError}>{errors.newPassword.message}</Text>
                }

                <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                    {t("confirm_password")} *
                </Text>
                <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{ required: t("this_field_is_required") as string, validate: curr => watch("newPassword") === curr || t("passwords_do_not_match") }}
                    render={({ field: { onChange, value } }) => (
                        <PasswordInput value={value} onChangeText={onChange} placeholder={t("placeholder_confirm_password")} />
                    )}
                />
                {
                    errors.confirmPassword &&
                    <Text style={styles.inputError}>{errors.confirmPassword.message}</Text>
                }
            </View>

            <View
                style={{
                    paddingBottom: isKeyboardVisible ? 12 : 0
                }}
            >
                <Button
                    title={t("update_password")}
                    onPress={handleSubmit(onSubmit)}
                />
            </View>

            {isPending && <Loading />}

            <ErrorModal
                visible={!!savingError}
                title={t("password_update_failed")}
                message={savingError || ""}
                onClose={() => setSavingError(null)}
            />
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 50,
        gap: 15
    },
    success: {
        fontSize: 16
    },
    inputError: {
        fontSize: 14,
        color: "#ff0000"
    }
})

export default Security;
