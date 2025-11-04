import { Colors } from "@/constants/Colors";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import useVehicles from "@/hooks/useVehicles";
import { VehicleInterface } from "@/types/vehicle";
import { Controller, useForm } from "react-hook-form";
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

const VehicleForm = () => {
    const colorScheme = useColorScheme() || "light";
    const { currentProfile } = useCurrentProfile();

    const {
        mutate,
        error,
        isPending
    } = useVehicles();

    const {
        formState: { errors },
        handleSubmit,
        watch,
        control
    } = useForm<VehicleInterface>();

    const onSubmit = () => {
        mutate({
            ...watch(),
            driverId: currentProfile?.id || ""
        })
    }

    return (
        <>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={80}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.contentForm}>
                        <View
                            style={{
                                gap: 3
                            }}
                        >
                            <Text style={{ fontSize: 16, color: Colors[colorScheme].text }}>
                                Plate number *
                            </Text>
                            <Controller
                                name="plateNumber"
                                control={control}
                                rules={{
                                    required: "This field is required",
                                    minLength: {
                                        message: "Enter 4 minimum characters",
                                        value: 4
                                    },
                                    maxLength: {
                                        message: "Enter 8 maximum characters",
                                        value: 8
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Vehicle plate number"
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
                                Make *
                            </Text>
                            <Controller
                                name="make"
                                control={control}
                                rules={{
                                    required: "This field is required"
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Vehicle made"
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
                                Model *
                            </Text>
                            <Controller
                                name="model"
                                control={control}
                                rules={{
                                    required: "This field is required"
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Vehicle model"
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
                                Year *
                            </Text>
                            <Controller
                                name="year"
                                control={control}
                                rules={{
                                    required: "This field is required"
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Vehicle year"
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
                                Width (m) *
                            </Text>
                            <Controller
                                name="width"
                                control={control}
                                rules={{
                                    required: "This field is required"
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Vehicle width"
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
                                Length (m) *
                            </Text>
                            <Controller
                                name="length"
                                control={control}
                                rules={{
                                    required: "This field is required"
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Vehicle length"
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
                                height (m) *
                            </Text>
                            <Controller
                                name="height"
                                control={control}
                                rules={{
                                    required: "This field is required"
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        onChangeText={onChange}
                                        value={value}
                                        placeholder="Vehicle height"
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
                            error &&
                            <Text style={styles.inputError}>{error.message}</Text>
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
                    title="Add vehicle"
                    onPress={handleSubmit(onSubmit)}
                />
            </View>
            {
                isPending &&
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