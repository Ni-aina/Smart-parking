import { getReservationsByDriverId } from "@/actions/reservation.action";
import { supabase } from "@/lib/supabase";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useCurrentProfile from "../useCurrentProfile";

const useReservations = () => {
    const { currentProfile } = useCurrentProfile();
    const driverId = currentProfile?.id || "";

    const {
        data,
        isLoading,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching
    } = useInfiniteQuery({
        queryKey: [`fetch-reservations-${driverId}`],
        queryFn: async ({ pageParam = 1 }) => {
            return await getReservationsByDriverId({
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

    const reservations = data?.pages.flatMap(({ data }) => data);

    useEffect(() => {
        if (isLoading) return;

        const channelName = `reservations:${driverId}`;

        const existingChannel = supabase.getChannels().find(c => c.topic === `realtime:${channelName}`);
        if (existingChannel) {
            supabase.removeChannel(existingChannel);
        }

        const reservationsChannel = supabase.channel(channelName)
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
            supabase.removeChannel(reservationsChannel);
        }
    }, [
        driverId,
        isLoading,
        refetch
    ])

    return {
        reservations,
        isLoading,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching
    }
}

export default useReservations;