import { Colors } from "@/constants/Colors";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import useKeyboardVisible from "@/hooks/useKeyboardVisible";
import useVehicles from "@/hooks/vehicles/useVehicles";
import { VehicleInterface } from "@/types/vehicle";
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
import Button from "../ui/button";
import Loading from "../ui/loading";

interface VehicleFormInterface {
    vehicle?: VehicleInterface
}

const VehicleForm = ({
    vehicle
}: VehicleFormInterface) => {
    const { t } = useTranslation()
    const colorScheme = useColorScheme() || "light";
    const { currentProfile } = useCurrentProfile();

    const isKeyboardVisible = useKeyboardVisible();

    const {
        handleCreate,
        creationError,
        isCreating,
        handleUpdate,
        updateError,
        isUpdating,
    } = useVehicles();

    const {
        formState: { errors },
        handleSubmit,
        watch,
        control
    } = useForm<VehicleInterface>({
        defaultValues: {
            id: vehicle?.id || "",
            driverId: vehicle?.driverId || "",
            plateNumber: vehicle?.plateNumber || "",
            make: vehicle?.make || "",
            model: vehicle?.model || "",
            year: vehicle?.year && Number(vehicle.year).toString() || "",
            width: vehicle?.width && Number(vehicle.width).toString() || "",
            length: vehicle?.length && Number(vehicle.length).toString() || "",
            height: vehicle?.height && Number(vehicle.height).toString() || ""
        }
    })

    const onSubmit = () => {
        if (watch("id")) {
            handleUpdate(watch());
            return;
        }
        handleCreate({
            ...watch(),
            driverId: currentProfile?.id || ""
        })
    }

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={
                    Platform.OS === "ios" ? "padding" :
                        isKeyboardVisible ? "height" : undefined
                }
                keyboardVerticalOffset={90}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.contentForm}>
                        <View
                            style={{
                                gap: 3
                            }}
                        >
                            <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                                {t("plate_number_label")} *
                            </Text>
                            <Controller
                                name="plateNumber"
                                control={control}
                                rules={{
                                    required: t("this_field_is_required") as string,
                                    minLength: {
                                        message: t("enter_4_min_chars"),
                                        value: 4
                                    },
                                    maxLength: {
                                        message: t("enter_10_max_chars"),
                                        value: 10
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder={t("vehicle_plate_placeholder")}
                                        style={[
                                            styles.inputForm,
                                            {
                                                color: Colors[colorScheme].text,
                                                borderColor: Colors[colorScheme].text
                                            }
                                        ]}
                                    />
                                )}
                            />
                            {
                                errors.plateNumber &&
                                <Text style={styles.inputError}>{errors.plateNumber.message}</Text>
                            }
                        </View>
                        <View
                            style={{
                                gap: 3
                            }}
                        >
                            <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                                {t("make_label")} *
                            </Text>
                            <Controller
                                name="make"
                                control={control}
                                rules={{
                                    required: t("this_field_is_required") as string
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder={t("vehicle_made_placeholder")}
                                        style={[
                                            styles.inputForm,
                                            {
                                                color: Colors[colorScheme].text,
                                                borderColor: Colors[colorScheme].text
                                            }
                                        ]}
                                    />
                                )}
                            />
                            {
                                errors.make &&
                                <Text style={styles.inputError}>{errors.make.message}</Text>
                            }
                        </View>
                        <View
                            style={{
                                gap: 3
                            }}
                        >
                            <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                                {t("model_label")} *
                            </Text>
                            <Controller
                                name="model"
                                control={control}
                                rules={{
                                    required: t("this_field_is_required") as string
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder={t("vehicle_model_placeholder")}
                                        style={[
                                            styles.inputForm,
                                            {
                                                color: Colors[colorScheme].text,
                                                borderColor: Colors[colorScheme].text
                                            }
                                        ]}
                                    />
                                )}
                            />
                            {
                                errors.model &&
                                <Text style={styles.inputError}>{errors.model.message}</Text>
                            }
                        </View>
                        <View
                            style={{
                                gap: 3
                            }}
                        >
                            <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                                {t("year_label")} *
                            </Text>
                            <Controller
                                name="year"
                                control={control}
                                rules={{
                                    required: t("this_field_is_required") as string
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder={t("vehicle_year_placeholder")}
                                        keyboardType="number-pad"
                                        style={[
                                            styles.inputForm,
                                            {
                                                color: Colors[colorScheme].text,
                                                borderColor: Colors[colorScheme].text
                                            }
                                        ]}
                                    />
                                )}
                            />
                            {
                                errors.year &&
                                <Text style={styles.inputError}>{errors.year.message}</Text>
                            }
                        </View>
                        <View
                            style={{
                                gap: 3
                            }}
                        >
                            <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                                {t("width_label")} *
                            </Text>
                            <Controller
                                name="width"
                                control={control}
                                rules={{
                                    required: t("this_field_is_required") as string
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder={t("vehicle_width_placeholder")}
                                        keyboardType="number-pad"
                                        style={[
                                            styles.inputForm,
                                            {
                                                color: Colors[colorScheme].text,
                                                borderColor: Colors[colorScheme].text
                                            }
                                        ]}
                                    />
                                )}
                            />
                            {
                                errors.width &&
                                <Text style={styles.inputError}>{errors.width.message}</Text>
                            }
                        </View>
                        <View
                            style={{
                                gap: 3
                            }}
                        >
                            <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                                {t("length_label")} *
                            </Text>
                            <Controller
                                name="length"
                                control={control}
                                rules={{
                                    required: t("this_field_is_required") as string
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder={t("vehicle_length_placeholder")}
                                        keyboardType="number-pad"
                                        style={[
                                            styles.inputForm,
                                            {
                                                color: Colors[colorScheme].text,
                                                borderColor: Colors[colorScheme].text
                                            }
                                        ]}
                                    />
                                )}
                            />
                            {
                                errors.length &&
                                <Text style={styles.inputError}>{errors.length.message}</Text>
                            }
                        </View>
                        <View
                            style={{
                                gap: 3
                            }}
                        >
                            <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                                {t("height_label")} *
                            </Text>
                            <Controller
                                name="height"
                                control={control}
                                rules={{
                                    required: t("this_field_is_required") as string
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder={t("vehicle_height_placeholder")}
                                        keyboardType="number-pad"
                                        style={[
                                            styles.inputForm,
                                            {
                                                color: Colors[colorScheme].text,
                                                borderColor: Colors[colorScheme].text
                                            }
                                        ]}
                                    />
                                )}
                            />
                            {
                                errors.height &&
                                <Text style={styles.inputError}>{errors.height.message}</Text>
                            }
                        </View>
                        {
                            creationError &&
                            <Text style={styles.inputError}>{creationError.message}</Text>
                        }
                        {
                            updateError &&
                            <Text style={styles.inputError}>{updateError.message}</Text>
                        }
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            <View
                style={{
                    paddingBottom: 10
                }}
            >
                <Button
                    title={watch("id") ? t("update_vehicle_btn") : t("add_vehicle_btn")}
                    onPress={handleSubmit(onSubmit)}
                />
            </View>
            {
                (isCreating || isUpdating) &&
                <Loading />
            }
        </>
    )
}

const styles = StyleSheet.create({
    contentForm: {
        gap: 10,
        paddingBottom: 15
    },
    inputForm: {
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: 10
    },
    inputError: {
        fontSize: 14,
        color: "#ff0000"
    }
})

export default VehicleForm;