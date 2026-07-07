import { getProfilesForConversation } from "@/actions/message.action";
import { useQuery } from "@tanstack/react-query";
import useCurrentProfile from "../useCurrentProfile";

const useConversationProfiles = (searchTerm: string) => {
    const { currentProfile } = useCurrentProfile();
    const userId = currentProfile?.id || "";

    const {
        data: profiles = [],
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ["conversation-profiles", userId, searchTerm],
        queryFn: () => getProfilesForConversation(userId, searchTerm),
        enabled: !!userId
    })

    return {
        profiles,
        isLoading,
        error,
        refetch,
        currentProfile
    }
}

export default useConversationProfiles;
