import { getCurrentProfile } from "@/actions/profile.action";
import { useQuery } from "@tanstack/react-query";

const useCurrentProfile = () => {
    const {
        data: currentProfile,
        isPending,
        error
    } = useQuery({
        queryKey: ["current-profile"],
        queryFn: getCurrentProfile,
        refetchInterval: 1000 * 60 * 15,
        refetchIntervalInBackground: true
    })

    return {
        currentProfile,
        isPending,
        error
    }
}

export default useCurrentProfile;