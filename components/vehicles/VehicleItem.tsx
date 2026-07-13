import { Colors } from "@/constants/Colors";
import { VehicleInterface } from "@/types/vehicle";
import { Ionicons } from "@expo/vector-icons";
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";
import ConfirmModal from "../ui/confirmModal";

interface VehicleItemInterface {
    vehicle: VehicleInterface;
    handleDelete: (id: string) => void;
}

const VehicleItem = ({
    vehicle,
    handleDelete
}: VehicleItemInterface) => {
    const { t } = useTranslation()
    const colorscheme = useColorScheme() || "light";
    const router = useRouter();

    const [showConfirm, setShowConfirm] = useState(false);

    const handleNavigateToUpdate = () => {
        router.push({
            pathname: "/vehicleControls/editVehicle",
            params: {
                vehicle: JSON.stringify(vehicle)
            }
        })
    }

    const handleNavigateToMaintenance = () => {
        router.push({
            pathname: "/vehicleControls/maintenanceList",
            params: {
                vehicle: JSON.stringify(vehicle)
            }
        })
    }

    const handleToggleConfirm = () => {
        setShowConfirm(prev => !prev);
    }

    const handleDeleteConfirm = () => {
        const {
            id
        } = vehicle;
        if (!id) return;
        setShowConfirm(false);
        handleDelete(id);
    }

    const {
        make,
        model,
        plateNumber
    } = vehicle;

    return (
        <View
            style={[
                styles.container,
                {
                    borderColor: Colors[colorscheme].icon
                }
            ]}
        >
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 20
                }}
            >
                <Ionicons
                    name="car-outline"
                    size={32}
                    color={Colors[colorscheme].tint}
                />
                <View
                    style={{
                        paddingVertical: 5,
                        gap: 5
                    }}
                >
                    <Text
                        style={{
                            color: Colors[colorscheme].text,
                            fontSize: 16,
                            fontWeight: "700",
                            width: 135
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {make} {model}
                    </Text>
                    <Text
                        style={{
                            color: Colors[colorscheme].icon,
                            fontSize: 14
                        }}
                    >
                        {plateNumber}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    columnGap: 15
                }}
            >
                <Pressable
                    style={({ pressed }) => pressed && {
                        opacity: 0.6
                    }}
                    onPress={handleNavigateToMaintenance}
                >
                    <Feather
                        name="eye"
                        size={24}
                        color="yellowgreen"
                    />
                </Pressable>
                <Pressable
                    style={({ pressed }) => pressed && {
                        opacity: 0.6
                    }}
                    onPress={handleNavigateToUpdate}
                >
                    <Feather
                        name="edit"
                        size={24}
                        color="orange"
                    />
                </Pressable>
                <Pressable
                    style={({ pressed }) => pressed && {
                        opacity: 0.6
                    }}
                    onPress={handleToggleConfirm}
                >
                    <Feather
                        name="trash"
                        size={24}
                        color="red"
                    />
                </Pressable>
            </View>
            <ConfirmModal
                visible={showConfirm}
                title={t("danger_zone")}
                message={t("confirm_delete_vehicle", { plateNumber: vehicle.plateNumber })}
                onConfirm={handleDeleteConfirm}
                onCancel={handleToggleConfirm}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        borderWidth: 0.2,
        borderRadius: 8,
        gap: 5
    }
})

export default VehicleItem;