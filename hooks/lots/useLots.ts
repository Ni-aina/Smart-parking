import { getParkingLots } from "@/actions/lots.action";
import { supabase } from "@/lib/supabase";
import { useLocationStore } from "@/stores/zustand/location";
import { getDistanceTimeFromPostGIS } from "@/utils/getDistanceTime";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useCurrentProfile from "../useCurrentProfile";

const useLots = ({
    searchTerm
}: {
    searchTerm: string;
}) => {
    const { currentProfile } = useCurrentProfile();
    const profileId = currentProfile?.id!;

    const {
        location,
        refreshLocation
    } = useLocationStore();

    const latitude = location?.latitude || null;
    const longitude = location?.longitude || null;

    const {
        data: lots,
        isLoading,
        error,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching
    } = useInfiniteQuery({
        queryKey: [
            "parking-lots",
            searchTerm
        ],
        queryFn: async ({
            pageParam = 1
        }) => {
            await refreshLocation();
            return await getParkingLots({
                searchTerm,
                location: {
                    latitude,
                    longitude
                },
                pagination: {
                    page: pageParam,
                    limit: 10
                }
            });
        },
        getNextPageParam: (lastPage) => {
            return lastPage.hasMore
                ? lastPage.nextPage
                : undefined;
        },
        initialPageParam: 1
    })

    const lotsFormated = lots?.pages.flatMap(({ data }) =>
        data.map(item => ({
            ...item,
            distance: getDistanceTimeFromPostGIS(
                item.distanceM,
                70
            )
        }))
    ) || [];

    useEffect(() => {
        if (isLoading) return;
        refetch();
    }, [
        isLoading,
        latitude,
        longitude,
        refetch
    ])

    useEffect(() => {
        if (isLoading) return;
        
        const lotsChannel = supabase.channel(`lots:occupancy:${profileId}`)
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
            supabase.removeChannel(lotsChannel);
        }
    }, [
        profileId,
        isLoading,
        refetch
    ])

    return {
        lots: lotsFormated,
        isLoading,
        error,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching
    }
}

export default useLots;