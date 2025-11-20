import { Colors } from "@/constants/Colors";
import { VehicleInterface } from "@/types/vehicle";
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";
import ConfirmModal from "../ui/confirmModal";

interface VehicleItemInterface {
    vehicle: VehicleInterface;
    handleDelete: (id: string)=> void;
}

const VehicleItem = ({
    vehicle,
    handleDelete
}: VehicleItemInterface) => {
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
                <Image
                    source={require("@/assets/images/vehicles/default-car.png")}
                    style={{
                        width: 60,
                        height: 60,
                        transform: "rotate(-90deg)"
                    }}
                />
                <View
                    style={{
                        gap: 5
                    }}
                >
                    <Text
                        style={{
                            color: Colors[colorscheme].text,
                            fontSize: 16,
                            fontWeight: "700"
                        }}
                    >
                        {model}
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
                title="Danger zone"
                message={`Are you sure you want to delete ${vehicle.plateNumber} ?`}
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