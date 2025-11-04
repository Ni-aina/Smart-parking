import { Colors } from "@/constants/Colors";
import { VehicleInterface } from "@/types/vehicle";
import Feather from '@expo/vector-icons/Feather';
import {
    Image,
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

    const {
        id,
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
                <Feather
                    name="eye"
                    size={24}
                    color="yellowgreen"
                />
                <Feather
                    name="edit"
                    size={24}
                    color="orange"
                />
                <Feather
                    name="trash"
                    size={24}
                    color="red"
                />
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