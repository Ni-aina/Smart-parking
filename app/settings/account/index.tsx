import { updateProfile } from "@/actions/profile.action";
import Button from "@/components/ui/button";
import ErrorModal from "@/components/ui/errorModal";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import { Colors } from "@/constants/Colors";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { ProfileUpdateInterface } from "@/types/profile";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";
import { isValidPhoneNumber } from "react-phone-number-input";
import PhoneInput from "react-phone-number-input/react-native-input";

const Account = () => {
    const { t } = useTranslation();
    const { currentProfile } = useCurrentProfile();
    const queryClient = useQueryClient();

    const colorScheme = useColorScheme() || "light";

    const [isPending, setIsPending] = useState(false);
    const [savingError, setSavingError] = useState("");

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<ProfileUpdateInterface>({
        defaultValues: {
            id: currentProfile?.id || "",
            fullName: currentProfile?.fullName || "",
            emailAddress: currentProfile?.emailAddress || "",
            phoneNumber: currentProfile?.phoneNumber || ""
        }
    })

    const onSubmit = async (data: ProfileUpdateInterface) => {
        try {
            const { id } = currentProfile!;
            if (!id) throw new Error();

            setIsPending(true);

            const {
                fullName,
                emailAddress,
                phoneNumber
            } = data;

            const profile = await updateProfile({
                id,
                fullName,
                emailAddress,
                phoneNumber
            })

            if (!profile) throw new Error();

            queryClient.invalidateQueries({ queryKey: ["current-profile"] });
        } catch (err) {
            setSavingError(t("error_update_profile"));
        } finally {
            setIsPending(false);
        }
    }

    useEffect(() => {
        if (!savingError) return;

        const errorTimedOut = setTimeout(() => {
            setSavingError("")
        }, 2000)

        return () => {
            clearTimeout(errorTimedOut)
        }
    }, [savingError])

    return (
        <View style={styles.container}>
            <Header
                title={t("personal_data")}
            />
            <View style={styles.profileContainer}>
                <View
                    style={[styles.profilePicture, { backgroundColor: Colors[colorScheme].text }]}
                >
                    <Text
                        style={{
                            color: Colors[colorScheme].background,
                            fontSize: 36
                        }}
                    >
                        {currentProfile?.fullName.at(0)?.toString().toUpperCase()}
                    </Text>
                </View>
            </View>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.contentInfo}>
                        <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                            {t("email_address")}
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
                                                borderColor: Colors[colorScheme].background,
                                                backgroundColor: Colors[colorScheme].background,
                                                paddingHorizontal: 12
                                            }
                                        ]}
                                        placeholderTextColor={Colors[colorScheme].text}
                                        editable={false}
                                    />
                                )}
                            />
                            {
                                errors.emailAddress &&
                                <Text style={styles.inputError}>{errors.emailAddress.message}</Text>
                            }
                        </View>

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
                    </View>
                </ScrollView>
                <Button title={t("update_profile")} onPress={handleSubmit(onSubmit)} />
            </KeyboardAvoidingView>

            {isPending && <Loading />}

            <ErrorModal
                visible={!!savingError}
                title={t("error_update_profile")}
                message={savingError}
                onClose={
                    () => setSavingError("")
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 60,
        gap: 15
    },
    profileContainer: {
        marginVertical: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    profilePicture: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
        width: 110,
        height: 110
    },
    contentInfo: {
        flex: 1,
        gap: 10,
        paddingBottom: 15
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

export default Account;