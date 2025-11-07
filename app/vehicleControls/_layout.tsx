import ProtectedRoute from "@/components/ProtectedRoute";
import { Stack } from "expo-router";

const VehicleControlsLayout = () => {
    return (
        <ProtectedRoute>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen
                    name="addVehicle"
                    options={{
                        presentation: "modal"
                    }}
                />
                <Stack.Screen
                    name="editVehicle"
                    options={{
                        presentation: "modal"
                    }}
                />
            </Stack>
        </ProtectedRoute>
    )
}

export default VehicleControlsLayout;