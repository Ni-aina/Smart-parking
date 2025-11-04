import { useAuthContext } from "@/stores/context/AuthContext";
import { Redirect } from "expo-router";
import { ReactNode } from "react";
import Loading from "./ui/loading";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { 
        session, 
        loading 
    } = useAuthContext();

    if (loading) return <Loading />;

    if (!session) return <Redirect href={"/auth/signIn"} />;

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute;