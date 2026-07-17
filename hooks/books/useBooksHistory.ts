import { getBooksHistoryByDriverId } from "@/actions/reservation.action";
import { supabase } from "@/lib/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useCurrentProfile from "../useCurrentProfile";

const useBookHistory = () => {
    const { currentProfile } = useCurrentProfile();
    const driverId = currentProfile?.id || "";

    const {
        data,
        isLoading,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: [`fetch-book-history-${driverId}`],
        queryFn: async ({ pageParam = 1 }) => {
            return await getBooksHistoryByDriverId({
                driverId,
                page: pageParam,
                limit: 10
            })
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore
                ? lastPage.nextPage
                : undefined
        },
        initialPageParam: 1
    })

    const booksHistory = data?.pages.flatMap(({ data }) => data);

    useEffect(() => {
        if (isLoading) return;

        const booksChannel = supabase.channel(`books:history:${driverId}`)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "reservations"
                },
                () => {
                    refetch();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(booksChannel);
        }
    }, [
        driverId,
        isLoading,
        refetch
    ])

    return {
        booksHistory,
        isLoading,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching,
        isFetchingNextPage
    }
}

export default useBookHistory;