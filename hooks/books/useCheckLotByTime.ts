import { checkLotByTime } from "@/actions/reservation.action";
import { useQuery } from "@tanstack/react-query";

interface useCheckLotByTimeProps {
    lotId: string;
    startTime: Date;
    endTime: Date;
}

const useCheckLotByTime = ({
    lotId,
    startTime,
    endTime
}: useCheckLotByTimeProps) => {

    const {
        data: availableSpots,
        isLoading
    } = useQuery({
        queryKey: [`check-lot-availability-${lotId}-${startTime}-${endTime}`],
        queryFn: () => checkLotByTime(lotId, startTime, endTime)
    })

    return {
        availableSpots,
        isLoading
    }
}

export default useCheckLotByTime;