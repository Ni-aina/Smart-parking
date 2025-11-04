import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState
} from "react";

type AuthContextType = {
    session: Session | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    loading: true
})

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {

    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        })

        const { data } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
            }
        )

        return () => data.subscription.unsubscribe();
    }, [])

    return (
        <AuthContext.Provider
            value={{
                session,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const authContext = useContext(AuthContext);
    if (!authContext) throw new Error("This context cannot be use outside of auth context");
    const {
        session,
        loading
    } = authContext;
    return {
        session,
        loading
    }
}