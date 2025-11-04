import Icons from "@/components/ui/icons";
import VehicleForm from "@/components/vehicles/VehicleForm";
import { Colors } from "@/constants/Colors";
import { useLotStore } from "@/stores/zustand/lot";
import { useRouter } from "expo-router";
import {
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

const AddVehicle = () => {
    const colorSchema = useColorScheme() || "light";
    const router = useRouter();
    const { lot, setLot } = useLotStore();

    return (
        <View
            style={styles.container}
        >
            <View style={styles.headerContent}>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: Colors[colorSchema].text
                    }}
                >
                    Add Vehicle
                </Text>
                <Icons
                    name="close"
                    size={28}
                    color={Colors[colorSchema].text}
                    onPress={() => router.back()}
                />
            </View>
            <VehicleForm />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
        gap: 20
    },
    headerContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
})

export default AddVehicle;