import ProtectedRoute from "@/components/ProtectedRoute";
import { Stack } from "expo-router";

const VehicleControlsLayout = () => {
    return (
        <ProtectedRoute>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="addVehicle" />
                <Stack.Screen name="editVehicle" />
                <Stack.Screen name="maintenanceList" />
            </Stack>
        </ProtectedRoute>
    )
}

export default VehicleControlsLayout;