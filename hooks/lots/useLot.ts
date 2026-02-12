import { getParkingById } from "@/actions/lots.action";
import { useLocationStore } from "@/stores/zustand/location";
import { getDistanceTime } from "@/utils/getDistanceTime";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const useLot = ({ id }: { id: string }) => {
    const {
        location,
        refreshLocation
    } = useLocationStore();

    const latitude = location?.latitude;
    const longitude = location?.longitude;

    const {
        data: lot,
        isLoading,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: [`lot-details-${id}`],
        queryFn: () => {
            refreshLocation();
            return getParkingById(id);
        }
    })

    const lotFormated = {
        ...lot,
        distance: getDistanceTime(
            latitude,
            longitude,
            lot?.locationLat,
            lot?.locationLng
        )
    }

    useEffect(()=> {
        if (isLoading) return;
        refetch();
    }, [
        isLoading,
        latitude,
        longitude,
        refetch
    ])

    return {
        lot: lotFormated,
        isLoading,
        refetch,
        isRefetching
    }
}

export default useLot;