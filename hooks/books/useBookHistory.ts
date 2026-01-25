import { getBooksHistoryByDriverId } from "@/actions/reservation.action";
import { useQuery } from "@tanstack/react-query";
import useCurrentProfile from "../useCurrentProfile";

const useBookHistory = () => {
    const { currentProfile } = useCurrentProfile();
    const driverId = currentProfile?.id || "";

    const {
        data: booksHistory,
        isLoading,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: [`fetch-book-history-${driverId}`],
        queryFn: () => getBooksHistoryByDriverId(driverId)
    })

    return {
        booksHistory,
        isLoading,
        refetch,
        isRefetching
    }
}

export default useBookHistory;