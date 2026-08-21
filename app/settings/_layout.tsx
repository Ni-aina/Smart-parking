import ProtectedRoute from "@/components/ProtectedRoute";
import { Stack } from "expo-router";

const SettingsLayout = () => {
    return (
        <ProtectedRoute>
            <Stack screenOptions={{ headerShown: false }} />
        </ProtectedRoute>
    )
}

export default SettingsLayout;