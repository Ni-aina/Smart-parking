import { getParkingById } from "@/actions/lots.action";
import { useLocationStore } from "@/stores/zustand/location";
import { getDistanceTime } from "@/utils/getDistanceTime";
import { useQuery } from "@tanstack/react-query";

const useLot = ({ id }: { id: string }) => {
    const {
        location,
        refreshLocation
    } = useLocationStore();

    const {
        data: lot,
        isPending,
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
            location?.latitude,
            location?.longitude,
            lot?.locationLat,
            lot?.locationLng
        )
    }

    return {
        lot: lotFormated,
        isPending,
        refetch,
        isRefetching
    }
}

export default useLot;