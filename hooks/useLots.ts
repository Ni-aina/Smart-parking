import { getParkingLots } from "@/actions/lots.action";
import { useLocationStore } from "@/stores/zustand/location";
import { getDistanceTimeFromPostGIS } from "@/utils/getDistanceTime";
import { useQuery } from "@tanstack/react-query";

const useLots = () => {
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
        isRefetching
    } = useQuery({
        queryKey: ["parking-lots", latitude, longitude],
        queryFn: ()=> {
            refreshLocation();
            return getParkingLots({
                location: {
                    latitude,
                    longitude
                }
            });
        } 
    })

    const lotsFormated = lots?.map(item => {
        return {
            ...item,
            distance: getDistanceTimeFromPostGIS(
                item.distanceM,
                70
            )
        }
    }) || [];

    return {
        lots: lotsFormated,
        isPending,
        error,
        refetch,
        isRefetching
    }
}

export default useLots;