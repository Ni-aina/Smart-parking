import { Colors } from "@/constants/Colors";
import { useLotStore } from "@/stores/zustand/lot";
import { VehicleInterface } from "@/types/vehicle";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

interface VehicleSelectItemInterface {
    vehicle: VehicleInterface;
}

const VehicleSelectItem = ({
    vehicle
}: VehicleSelectItemInterface) => {
    const colorSchema = useColorScheme() || "light";

    const {
        id,
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
        if (
            !id ||
            Number(width) > maxWidth ||
            Number(height) > maxHeight ||
            Number(length) > maxLength
        ) return;

        setLot({
            ...lot,
            vehicleId: id
        })
    }

    const isActive = vehicleId === id;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                {
                    borderColor: Colors[colorSchema].icon,
                    backgroundColor: isActive ?
                        Colors[colorSchema === "light" ? "dark" : "light"]?.text :
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
                            color: Colors[colorSchema].text,
                            fontSize: 20,
                            fontWeight: "700"
                        }}
                    >
                        {model}
                    </Text>
                    <Text
                        style={{
                            color: Colors[colorSchema].icon,
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
                        Colors[colorSchema].tint :
                        Colors[colorSchema].tabIconDefault,
                    padding: 2
                }}
            >
                <View
                    style={{
                        width: 10,
                        height: 10,
                        borderRadius: 50,
                        borderWidth: 1,
                        borderColor: Colors[colorSchema].icon,
                        backgroundColor: isActive ?
                            Colors[colorSchema].icon :
                            Colors[colorSchema].background
                    }}
                />
            </View>
        </Pressable>
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