import ProtectedRoute from "@/components/ProtectedRoute";
import { Stack } from "expo-router";

const BooksLayout = () => {
    return (
        <ProtectedRoute>
            <Stack screenOptions={{ headerShown: false }}/>
        </ProtectedRoute>
    )
}
 
export default BooksLayout;