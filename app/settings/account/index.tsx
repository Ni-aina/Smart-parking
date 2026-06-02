import { updateProfile, updateProfilePicture } from "@/actions/profile.action";
import Button from "@/components/ui/button";
import ErrorModal from "@/components/ui/errorModal";
import Header from "@/components/ui/header";
import Icons from "@/components/ui/icons";
import Loading from "@/components/ui/loading";
import { Colors } from "@/constants/Colors";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { ProfileUpdateInterface } from "@/types/profile";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Image } from "moti";
import { Skeleton } from "moti/skeleton";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
    Keyboard,
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

const Account = () => {
    const { t } = useTranslation();
    const { currentProfile } = useCurrentProfile();
    const queryClient = useQueryClient();

    const colorScheme = useColorScheme() || "light";

    const [isPending, setIsPending] = useState(false);
    const [savingError, setSavingError] = useState("");
    const [loadingImage, setLoadingImage] = useState(!!currentProfile?.urlImage);

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

    const [uploadingImage, setUploadingImage] = useState(false);

    const handleProfilePicture = async () => {
        try {
            const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permission.granted) return;

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8
            })

            if (result.canceled) return;

            setUploadingImage(true);

            const image = result.assets[0];

            const profile = await updateProfilePicture({
                profileId: currentProfile!.id,
                imageUri: image.uri,
                oldUrl: currentProfile?.urlImage
            })

            if (!profile) throw new Error();

            queryClient.invalidateQueries({
                queryKey: ["current-profile"]
            })
        } catch {
            setSavingError(t("error_update_profile"));
        } finally {
            setUploadingImage(false);
        }
    }

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

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height)
        })
        const hide = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0)
        })
        return () => {
            show.remove()
            hide.remove()
        }
    }, [])

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
            <Pressable
                style={styles.profileContainer}
                onPress={handleProfilePicture}
            >
                {
                    loadingImage &&
                    <Skeleton
                        colorMode={colorScheme}
                        width={110}
                        height={110}
                        radius={100}
                    />
                }
                {
                    currentProfile?.urlImage ?
                        <Image
                            source={{ uri: currentProfile?.urlImage }}
                            style={
                                loadingImage ?
                                    styles.loadingPicture :
                                    styles.profilePicture
                            }
                            onLoadStart={
                                () => setLoadingImage(true)
                            }
                            onLoadEnd={
                                () => setLoadingImage(false)
                            }
                        />
                        :
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
                }
                <Icons
                    name="camera"
                    style={styles.editIcon}
                    onPress={handleProfilePicture}
                    color={Colors[colorScheme].tint}
                    size={20}
                />
            </Pressable>
            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 20 }}
                >
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

                <View
                    style={{
                        paddingBottom: keyboardHeight > 0 ? keyboardHeight + 12 : 40,
                        paddingTop: 12
                    }}
                >
                    <Button title={t("update_profile")} onPress={handleSubmit(onSubmit)} />
                </View>
            </View>

            {(isPending || uploadingImage) && <Loading />}

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
        paddingTop: 40,
        gap: 15
    },
    profileContainer: {
        position: "relative",
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
    loadingPicture: {
        width: 0,
        height: 0
    },
    editIcon: {
        position: "absolute",
        left: 40,
        bottom: 90
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