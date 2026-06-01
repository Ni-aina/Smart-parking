import { updatePassword } from "@/actions/user.action";
import { useMutation } from "@tanstack/react-query";

const usePassword = () => {

    const mutation = useMutation({
        mutationKey: ["update-password"],
        mutationFn: ({ email, currentPassword, newPassword }: { email: string; currentPassword: string; newPassword: string }) =>
            updatePassword(email, currentPassword, newPassword)
    })

    return mutation;
}

export default usePassword;
