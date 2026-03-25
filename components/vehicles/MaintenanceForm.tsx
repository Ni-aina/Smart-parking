import { Colors } from "@/constants/Colors";
import { VehicleMaintenanceInterface } from "@/types/maintenance";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
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
import Button from "../ui/button";
import Header from "../ui/header";
import Loading from "../ui/loading";

interface MaintenanceFormInterface {
    maintenance?: VehicleMaintenanceInterface;
    vehicleId: string;
    onSubmit: (data: VehicleMaintenanceInterface) => void;
    isLoading: boolean;
    setShowForm: (show: boolean) => void;
}

const MaintenanceForm = ({
    maintenance,
    vehicleId,
    onSubmit,
    isLoading,
    setShowForm
}: MaintenanceFormInterface) => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() || "light";
    const [showPerformedDatePicker, setShowPerformedDatePicker] = useState(false);
    const [showDueDatePicker, setShowDueDatePicker] = useState(false);

    const {
        formState: { errors },
        handleSubmit,
        control,
        watch
    } = useForm<VehicleMaintenanceInterface>({
        defaultValues: {
            id: maintenance?.id || "",
            vehicleId: vehicleId,
            maintenanceType: maintenance?.maintenanceType || "",
            performedDate: maintenance?.performedDate || "",
            dueDate: maintenance?.dueDate || "",
            notes: maintenance?.notes || ""
        }
    })

    const formatDateDisplay = (dateString: string | undefined) => {
        if (!dateString) return t("yyyy_mm_dd");
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch {
            return dateString;
        }
    }

    const handleFormSubmit = (data: VehicleMaintenanceInterface) => {
        onSubmit(data);
    }

    return (
        <>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <Header
                        title={maintenance ? t("edit_maintenance") : t("add_maintenance")}
                        customBackAction={() => setShowForm(false)}
                    />

                    <View style={styles.formGroup}>
                        <Text style={[
                            styles.label,
                            { color: Colors[colorScheme].text }
                        ]}>
                            {t("maintenance_type")} *
                        </Text>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        {
                                            backgroundColor: Colors[colorScheme].background,
                                            borderColor: errors.maintenanceType ? "#ff0000" : Colors[colorScheme].gray200,
                                            color: Colors[colorScheme].text
                                        }
                                    ]}
                                    placeholder={t("enter_maintenance_type")}
                                    placeholderTextColor="#999999"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                            name="maintenanceType"
                        />
                        {
                            errors.maintenanceType && 
                                <Text style={[styles.errorText, { color: "#ff0000" }]}>
                                    {t("maintenance_type_required")}
                                </Text>
                        }
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[
                            styles.label,
                            { color: Colors[colorScheme].text }
                        ]}>
                            {t("performed_date")} *
                        </Text>
                        <Controller
                            control={control}
                            rules={{ required: true }}
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.input,
                                            styles.dateInput,
                                            {
                                                backgroundColor: Colors[colorScheme].background,
                                                borderColor: errors.performedDate ? "#ff0000" : Colors[colorScheme].gray200,
                                                opacity: pressed ? 0.8 : 1
                                            }
                                        ]}
                                        onPress={() => setShowPerformedDatePicker(true)}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <Text
                                                style={{
                                                    color: value ? Colors[colorScheme].text : "#999999"
                                                }}
                                            >
                                                {formatDateDisplay(value)}
                                            </Text>
                                        </View>
                                        <Ionicons
                                            size={16}
                                            name="calendar"
                                            color={Colors[colorScheme].icon}
                                        />
                                    </Pressable>
                                    {
                                        showPerformedDatePicker && 
                                            <DateTimePicker
                                                value={value ? new Date(value) : new Date()}
                                                onChange={(_, selectedDate) => {
                                                    if (selectedDate) {
                                                        onChange(selectedDate.toISOString().split('T')[0]);
                                                    }
                                                    setShowPerformedDatePicker(false);
                                                }}
                                                display="spinner"
                                            />
                                    }
                                </>
                            )}
                            name="performedDate"
                        />
                        {
                            errors.performedDate && 
                                <Text style={[styles.errorText, { color: "#ff0000" }]}>
                                    {t("performed_date_required")}
                                </Text>
                        }
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[
                            styles.label,
                            { color: Colors[colorScheme].text }
                        ]}>
                            {t("due_date")} *
                        </Text>
                        <Controller
                            control={control}
                            rules={{ 
                                validate: (value) => value && new Date(value) >= new Date(watch("performedDate")) 
                                        || "Due date must be after performed date"
                            }}
                            render={({ field: { onChange, value } }) => (
                                <>
                                    <Pressable
                                        style={({ pressed }) => [
                                            styles.input,
                                            styles.dateInput,
                                            {
                                                backgroundColor: Colors[colorScheme].background,
                                                borderColor: errors.performedDate ? "#ff0000" : Colors[colorScheme].gray200,
                                                opacity: pressed ? 0.8 : 1
                                            }
                                        ]}
                                        onPress={() => setShowDueDatePicker(true)}
                                    >
                                        <View style={{ flex: 1 }}>
                                            <Text
                                                style={{
                                                    color: value ? Colors[colorScheme].text : "#999999"
                                                }}
                                            >
                                                {formatDateDisplay(value)}
                                            </Text>
                                        </View>
                                        <Ionicons
                                            size={16}
                                            name="calendar"
                                            color={Colors[colorScheme].icon}
                                        />
                                    </Pressable>
                                    {
                                        showDueDatePicker && 
                                            <DateTimePicker
                                                value={value ? new Date(value) : new Date()}
                                                onChange={(_, selectedDate) => {
                                                    if (selectedDate) {
                                                        onChange(selectedDate.toISOString().split('T')[0]);
                                                    }
                                                    setShowDueDatePicker(false);
                                                }}
                                                display="spinner"
                                            />
                                    }
                                </>
                            )}
                            name="dueDate"
                        />
                        {
                            errors.dueDate && 
                                <Text style={[styles.errorText, { color: "#ff0000" }]}>
                                    {t("due_date_after_performed")}
                                </Text>
                        }
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={[
                            styles.label,
                            { color: Colors[colorScheme].text }
                        ]}>
                            {t("notes")}
                        </Text>
                        <Controller
                            control={control}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[
                                        styles.input,
                                        styles.textArea,
                                        {
                                            backgroundColor: Colors[colorScheme].background,
                                            borderColor: Colors[colorScheme].gray200,
                                            color: Colors[colorScheme].text
                                        }
                                    ]}
                                    placeholder={t("enter_notes")}
                                    placeholderTextColor="#999999"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    multiline
                                    numberOfLines={4}
                                    textAlignVertical="top"
                                />
                            )}
                            name="notes"
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button
                            title={maintenance ? t("edit_maintenance") : t("add_maintenance")}
                            onPress={handleSubmit(handleFormSubmit)}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
            {
                isLoading && <Loading />
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollView: {
        flex: 1
    },
    contentContainer: {
        padding: 20,
        paddingTop: 60,
        gap: 20
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center"
    },
    formGroup: {
        marginBottom: 20
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 8
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16
    },
    dateInput: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    textArea: {
        height: 100,
        textAlignVertical: "top"
    },
    errorText: {
        fontSize: 14,
        color: "#ff0000",
        marginTop: 4
    },
    buttonContainer: {
        marginTop: 20,
        paddingBottom: 10
    }
})

export default MaintenanceForm;
