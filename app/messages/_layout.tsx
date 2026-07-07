import ProtectedRoute from "@/components/ProtectedRoute";
import { Stack } from "expo-router";

const MessageLayout = () => {
    return (
        <ProtectedRoute>
            <Stack screenOptions={{ headerShown: false }} />
        </ProtectedRoute>
    )
}

export default MessageLayout;