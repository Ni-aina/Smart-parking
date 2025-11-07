import { Colors } from "@/constants/Colors";
import { VehicleInterface } from "@/types/vehicle";
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from "expo-router";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

interface VehicleItemInterface {
    vehicle: VehicleInterface;
}

const VehicleItem = ({
    vehicle
}: VehicleItemInterface) => {
    const colorSchema = useColorScheme() || "light";
    const router = useRouter();

    const handleNavigateToUpdate = () => {
        router.push({
            pathname: "/vehicleControls/editVehicle",
            params: {
                vehicle: JSON.stringify(vehicle)
            }
        })
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
                    borderColor: Colors[colorSchema].icon
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
                            color: Colors[colorSchema].text,
                            fontSize: 16,
                            fontWeight: "700"
                        }}
                    >
                        {model}
                    </Text>
                    <Text
                        style={{
                            color: Colors[colorSchema].icon,
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
                >
                    <Feather
                        name="trash"
                        size={24}
                        color="red"
                    />
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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