import Button from "@/components/ui/button";
import ErrorModal from "@/components/ui/errorModal";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import SuccessModal from "@/components/ui/successModal";
import { Colors } from "@/constants/Colors";
import useKeyboardVisible from "@/hooks/useKeyboardVisible";
import { supabase } from "@/lib/supabase";
import { rejectTimeout } from "@/utils/rejectTimeout";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    KeyboardAvoidingView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";

interface ForgotPasswordValues {
    email: string
}

const ForgotPasswordScreen = () => {
    const colorScheme = useColorScheme() === "dark" ? "dark" : "light"
    const { t } = useTranslation()
    const router = useRouter()
    const isKeyboardVisible = useKeyboardVisible()
    const [isPending, setIsPending] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const {
        control,
        handleSubmit,
        formState,
        reset
    } = useForm<ForgotPasswordValues>()

    const onSubmit = async (data: ForgotPasswordValues) => {
        try {
            setIsPending(true)
            
            const { data: existingProfile } = await supabase
                .from("profiles")
                .select("*")
                .eq("email_address", data.email)
                .maybeSingle()

            if (!existingProfile) throw new Error(`${t("user_not_found")}`)

            const redirectTo = Linking.createURL("/auth/setPassword")
            const request = (async () => {
                const res = await supabase.auth.resetPasswordForEmail(data.email, {
                    redirectTo
                })
                if (res.error) {
                    throw new Error(res.error.message)
                }
                return true
            })()
            await Promise.race([request, rejectTimeout()])
            setIsSuccess(true)
            reset()
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : t("error_reset_password")
            setErrorMessage(message)
        } finally {
            setIsPending(false)
        }
    }

    useEffect(() => {
        if (!errorMessage) {
            return
        }
        const timer = setTimeout(() => {
            setErrorMessage("")
        }, 2000)
        return () => {
            clearTimeout(timer)
        }
    }, [errorMessage])

    const handleBack = () => router.push("/auth/signIn")
    const handleSuccessClose = () => {
        setIsSuccess(false)
        router.push("/auth/signIn")
    }
    const handleErrorClose = () => setErrorMessage("")

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView style={styles.flexOne} behavior={isKeyboardVisible ? "padding" : undefined}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    <View style={styles.headerWrapper}>
                        <Header title={t("forgot_password_title")} customBackAction={handleBack} />
                    </View>
                    <Text style={[styles.description, {
                        color: Colors[colorScheme].icon
                    }]}>
                        {t("forgot_password_description")}
                    </Text>
                    <Text style={[styles.label, {
                        color: Colors[colorScheme].text
                    }]}>
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
                            render={({ field }) => (
                                <TextInput
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    placeholder={t("email_placeholder")}
                                    placeholderTextColor={Colors[colorScheme].icon}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    style={[styles.input, {
                                        color: Colors[colorScheme].text,
                                        borderColor: Colors[colorScheme].tint
                                    }]}
                                />
                            )}
                        />
                        {
                            formState.errors.email &&
                            <Text style={styles.inputError}>
                                {formState.errors.email.message}
                            </Text>
                        }
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <Button title={t("send_reset_link")} onPress={handleSubmit(onSubmit)} />
            {
                isPending &&
                <Loading />
            }
            <SuccessModal
                visible={isSuccess}
                title={t("reset_link_sent_title")}
                message={t("reset_link_sent_description")}
                onClose={handleSuccessClose}
            />
            <ErrorModal
                visible={!!errorMessage}
                title={t("error_reset_password")}
                message={errorMessage}
                onClose={handleErrorClose}
            />
        </View>
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
    flexOne: {
        flex: 1
    },
    scrollContent: {
        gap: 15
    },
    headerWrapper: {
        marginBottom: 20
    },
    description: {
        fontSize: 16,
        lineHeight: 22
    },
    label: {
        fontSize: 16
    },
    inputContent: {
        gap: 5
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

export default ForgotPasswordScreen;
