import { Colors } from "@/constants/Colors";
import useCategory from "@/hooks/categories/useCategory";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import useKeyboardVisible from "@/hooks/useKeyboardVisible";
import useVehicles from "@/hooks/vehicles/useVehicles";
import { VehicleCategoryInterface } from "@/types/category";
import { VehicleInterface } from "@/types/vehicle";
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
import Button from "../ui/button";
import Loading from "../ui/loading";
import SelectInput from "../ui/selectInput";

interface VehicleFormInterface {
    vehicle?: VehicleInterface
}

const VehicleForm = ({
    vehicle
}: VehicleFormInterface) => {
    const { t } = useTranslation()
    const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
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

    const { categories } = useCategory();
    const selectCategories = categories?.map(item => {
        return {
            id: item.id,
            content: `${item.translations?.at(0)?.displayLabel || ""}, ${item.maxWeightTonnes}t, ↕${item.maxHeightMeters}m`
        }
    })

    const {
        formState: { errors, isSubmitted },
        handleSubmit,
        watch,
        control,
        setValue
    } = useForm<VehicleInterface>({
        defaultValues: {
            id: vehicle?.id || "",
            driverId: vehicle?.driverId || "",
            plateNumber: vehicle?.plateNumber || "",
            make: vehicle?.make || "",
            model: vehicle?.model || "",
            year: vehicle?.year && Number(vehicle.year).toString() || "",
            category: vehicle?.category
        }
    })

    const onSubmit = () => {
        if (!watch("category")?.id) return;

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
                behavior={isKeyboardVisible ? "padding" : undefined}
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
                        </View>
                        {
                            errors.year &&
                            <Text style={styles.inputError}>{errors.year.message}</Text>
                        }
                        <View
                            style={{
                                gap: 3
                            }}
                        >
                            <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                                {t("vehicle_category")} *
                            </Text>
                            <SelectInput
                                options={selectCategories || []}
                                value={{
                                    id: watch("category")?.id || "",
                                    content: selectCategories?.find(item => item.id === watch("category")?.id)?.content || ""
                                }}
                                setValue={(value) => {
                                    setValue("category",
                                        categories?.find((item) => item.id === value.id) as VehicleCategoryInterface
                                    )
                                }}
                                placeholder={t("select_category")}
                            />
                        </View>
                        {
                            (!watch("category")?.id && isSubmitted) &&
                            <Text style={styles.inputError}>{t("this_field_is_required")}</Text>
                        }

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
            <Button
                title={watch("id") ? t("update_vehicle_btn") : t("add_vehicle_btn")}
                onPress={handleSubmit(onSubmit)}
            />
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
        paddingBottom: 40
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