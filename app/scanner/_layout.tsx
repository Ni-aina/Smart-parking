import ProtectedRoute from "@/components/ProtectedRoute";
import { Stack } from "expo-router";

const ReservationLayout = () => {
    return (
        <ProtectedRoute>
            <Stack screenOptions={{ headerShown: false }}/>
        </ProtectedRoute>
    )
}
 
export default ReservationLayout;