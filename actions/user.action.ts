import { supabase } from "@/lib/supabase";
import { AuthenticatedUser, UnauthenticatedUser } from "@/types/authUser";
import { rejectTimeout } from "@/utils/rejectTimeout";
import { User } from "@supabase/supabase-js";

export async function createUser(email: string, password: string): Promise<User | null> {
    try {
        const request = (async () => {
            const { data: { user }, error } = await supabase.auth.signUp({
                email,
                password
            })

            if (!user || error) throw new Error(`An error occured during sign up, ${error?.message}`)

            return user;
        })()
        return Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function login(email: string, password: string): Promise<AuthenticatedUser | UnauthenticatedUser> {
    try {
        const request = (async () => {
            const { data: user, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw new Error(`Login failed: ${error.message}`);
            return user;
        })()

        return await Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function logout() {
    try {
        const request = supabase.auth.signOut();

        return await Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}

export async function updatePassword(email: string, password: string, newPassword: string): Promise<boolean> {
    try {
        const request = (async () => {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            })

            if (signInError) throw new Error(signInError.message);

            const { error: updateError } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (updateError) throw new Error(updateError.message);

            return true;
        })()

        return await Promise.race([
            request,
            rejectTimeout()
        ])
    } catch (error) {
        throw error;
    }
}