import { getParkingLots } from "@/actions/lots.action";
import { useLocationStore } from "@/stores/zustand/location";
import { getDistanceTimeFromPostGIS } from "@/utils/getDistanceTime";
import { useInfiniteQuery } from "@tanstack/react-query";

const useLots = ({
    searchTerm
}: {
    searchTerm: string;
}) => {
    const {
        location,
        refreshLocation
    } = useLocationStore();

    const latitude = location?.latitude || null;
    const longitude = location?.longitude || null;

    const {
        data: lots,
        isPending,
        error,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching
    } = useInfiniteQuery({
        queryKey: [
            "parking-lots",
            searchTerm,
            latitude,
            longitude
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
                    limit: 5
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

    return {
        lots: lotsFormated,
        isPending,
        error,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching
    }
}

export default useLots;