import Header from "@/components/ui/header";
import Icons from "@/components/ui/icons";
import VehicleList from "@/components/vehicles/VehicleList";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    useColorScheme,
    View
} from "react-native";

const SelectVehicleScreen = () => {
    const colorscheme = useColorScheme() || "light";
    const router = useRouter();

    return (
        <View
            style={styles.container}
        >
            <Header
                title="Select Vehicle"
                rightIcon={
                    <Icons
                        name="add"
                        size={30}
                        color={Colors[colorscheme].text}
                        onPress={() => router.push("/vehicleControls/addVehicle")}
                    />
                }
            />
            <VehicleList />
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
        gap: 20
    }
})

export default SelectVehicleScreen;