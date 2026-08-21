import ProtectedRoute from "@/components/ProtectedRoute";
import Button from "@/components/ui/button";
import ErrorModal from "@/components/ui/errorModal";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import PasswordInput from "@/components/ui/passwordInput";
import { Colors } from "@/constants/Colors";
import useKeyboardVisible from "@/hooks/useKeyboardVisible";
import { useSetPassword } from "@/hooks/usePassword";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";

interface SetPasswordInterface {
    newPassword: string;
    confirmPassword: string;
}

const SetPassword = () => {
    const colorScheme = useColorScheme() || "light";
    const { t } = useTranslation();

    const router = useRouter();

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<SetPasswordInterface>();
    const [savingError, setSavingError] = useState<string | null>(null);

    const { mutate, isPending, error, isSuccess } = useSetPassword();

    const onSubmit = (data: SetPasswordInterface) => {
        const { newPassword } = data
        mutate({ newPassword })
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
        if (error?.message) setSavingError(error.message)
        if (isSuccess) router.push("/auth/signIn")
    }, [
        isSuccess,
        error?.message
    ])

    return (
        <ProtectedRoute>
            <View style={styles.container}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={isKeyboardVisible ? "padding" : undefined}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ gap: 15 }}
                    >
                        <View
                            style={{
                                marginBottom: 20
                            }}
                        >
                            <Header
                                title={t("set_password")}
                            />
                        </View>

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
                    </ScrollView>
                </KeyboardAvoidingView>

                <Button
                    title={t("set_password")}
                    onPress={handleSubmit(onSubmit)}
                />

                {isPending && <Loading />}

                <ErrorModal
                    visible={!!savingError}
                    title={t("password_set_failed")}
                    message={savingError || ""}
                    onClose={() => setSavingError(null)}
                />
            </View>
         </ProtectedRoute>
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

export default SetPassword;
