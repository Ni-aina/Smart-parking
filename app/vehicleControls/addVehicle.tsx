import ProtectedRoute from "@/components/ProtectedRoute";
import Icons from "@/components/ui/icons";
import VehicleForm from "@/components/vehicles/VehicleForm";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

const AddVehicleScreen = () => {
    const { t } = useTranslation();
    const colorscheme = useColorScheme() || "light";
    const router = useRouter();

    return (
        <ProtectedRoute>
            <View
                style={styles.container}
            >
                <View style={styles.headerContent}>
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "700",
                            color: Colors[colorscheme].text
                        }}
                    >
                        {t("add_vehicle")}
                    </Text>
                    <Icons
                        name="close"
                        size={28}
                        color={Colors[colorscheme].text}
                        onPress={() => router.canGoBack() && router.back()}
                    />
                </View>
                <VehicleForm />
            </View>
        </ProtectedRoute>
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

export default AddVehicleScreen;