import ProtectedRoute from "@/components/ProtectedRoute";
import { Stack } from "expo-router";

const Reservation = () => {
    return (
        <ProtectedRoute>
            <Stack screenOptions={{ headerShown: false }}/>
        </ProtectedRoute>
    )
}
 
export default Reservation;