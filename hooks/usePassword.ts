import { setPassword, updatePassword } from "@/actions/user.action";
import { useMutation } from "@tanstack/react-query";

export const useSetPassword = () => {
    const mutation = useMutation({
        mutationKey: ["set-password"],
        mutationFn: ({ newPassword }: { newPassword: string }) => setPassword(newPassword)
    })

    return mutation;
}

const useUpdatePassword = () => {

    const mutation = useMutation({
        mutationKey: ["update-password"],
        mutationFn: ({ email, currentPassword, newPassword }:
            { email: string; currentPassword: string; newPassword: string }) =>
            updatePassword(email, currentPassword, newPassword)
    })

    return mutation;
}

export default useUpdatePassword;
