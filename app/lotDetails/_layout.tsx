import ProtectedRoute from "@/components/ProtectedRoute";
import { Stack } from "expo-router";

const LotDetailsLayout = () => {
    return (
        <ProtectedRoute>
            <Stack screenOptions={{ headerShown: false }}/>
        </ProtectedRoute>
    )
}
 
export default LotDetailsLayout;