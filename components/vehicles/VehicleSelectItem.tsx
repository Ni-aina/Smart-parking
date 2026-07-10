import { Colors } from "@/constants/Colors";
import { useLotStore } from "@/stores/zustand/lot";
import { VehicleInterface } from "@/types/vehicle";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";
import ErrorModal from "../ui/errorModal";

interface VehicleSelectItemInterface {
    vehicle: VehicleInterface;
}

const VehicleSelectItem = ({
    vehicle
}: VehicleSelectItemInterface) => {
    const { t } = useTranslation()
    const colorscheme = useColorScheme() || "light";
    const [error, setError] = useState("");

    const {
        id,
        make,
        model,
        plateNumber,
        width,
        height,
        length
    } = vehicle;

    const {
        lot,
        setLot
    } = useLotStore();

    const {
        vehicleId,
        maxWidth,
        maxHeight,
        maxLength
    } = lot;

    const handleVehicleSelected = () => {
        if (!id) {
            setError(t("vehicle_not_found"));
            return;
        }
        if (Number(width) > maxWidth) {
            setError(t("vehicle_too_large"));
            return;
        }
        if (Number(height) > maxHeight) {
            setError(t("vehicle_too_tall"));
            return;
        }
        if (Number(length) > maxLength) {
            setError(t("vehicle_too_long"));
            return;
        }

        setLot({
            ...lot,
            vehicleId: id,
            vehicleNumber: plateNumber,
            durationHours: ""
        })
    }

    const isActive = vehicleId === id;

    useEffect(() => {
        const timedOut = setTimeout(() => {
            setError("");
        }, 1000 * 3)
        return () => clearTimeout(timedOut);
    }, [error])

    return (
        <>
            <Pressable
                style={({ pressed }) => [
                    styles.container,
                    {
                        borderColor: Colors[colorscheme].icon,
                        backgroundColor: isActive ?
                            Colors[colorscheme === "light" ? "dark" : "light"]?.text :
                            "transparent"
                    },
                    pressed && {
                        opacity: 0.85
                    }
                ]}
                onPress={handleVehicleSelected}
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
                            width: 80,
                            height: 80,
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
                                fontSize: 20,
                                fontWeight: "700",
                                width: 180
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {make} {model}
                        </Text>
                        <Text
                            style={{
                                color: Colors[colorscheme].icon,
                                fontSize: 16
                            }}
                        >
                            {plateNumber}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: isActive ?
                            Colors[colorscheme].tint :
                            Colors[colorscheme].tabIconDefault,
                        padding: 2
                    }}
                >
                    <View
                        style={{
                            width: 10,
                            height: 10,
                            borderRadius: 50,
                            borderWidth: 1,
                            borderColor: Colors[colorscheme].icon,
                            backgroundColor: isActive ?
                                Colors[colorscheme].icon :
                                Colors[colorscheme].background
                        }}
                    />
                </View>
            </Pressable>
            <ErrorModal
                visible={!!error}
                title={t("failed_to_select_vehicle")}
                message={error}
                onClose={() => setError("")}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        gap: 5,
        borderWidth: 0.2,
        borderRadius: 10
    }
})

export default VehicleSelectItem;