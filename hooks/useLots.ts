import { getParkingLots } from "@/actions/lots.action";
import { useLocationStore } from "@/stores/zustand/location";
import { LotInterface } from "@/types/lot";
import { getDistanceTime } from "@/utils/getDistanceTime";
import { useQuery } from "@tanstack/react-query";

const useLots = () => {
    const {
        location,
        refreshLocation
    } = useLocationStore();
    
    const {
        data: lots,
        isPending,
        error,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: ["parking-lots"],
        queryFn: ()=> {
            refreshLocation();
            return getParkingLots();
        } 
    })

    const lotsFormated = lots?.map(item => {
        return {
            ...item,
            distance: getDistanceTime(
                location?.latitude,
                location?.longitude,
                item.locationLat,
                item.locationLng
            )
        }
    }) || []

    lotsFormated.sort((a: LotInterface, b: LotInterface) => {
        const aDistance = a.distance?.distanceKm;
        const bDistance = b.distance?.distanceKm;

        if (aDistance == null && bDistance == null) return 0;
        if (aDistance == null) return 1;
        if (bDistance == null) return -1;

        return aDistance - bDistance;
    })

    return {
        lots: lotsFormated,
        isPending,
        error,
        refetch,
        isRefetching
    }
}

export default useLots;