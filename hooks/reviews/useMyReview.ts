import { getMyReview } from "@/actions/review.action";
import { ReviewInterface } from "@/types/review";
import { useQuery } from "@tanstack/react-query";

const useMyReview = ({ lotId }: { lotId: number }) => {

    const { data, isLoading, refetch } = useQuery<ReviewInterface | null>({
        queryKey: ["my-review", lotId],
        queryFn: () => getMyReview(lotId),
        enabled: !!lotId
    })

    return {
        myReview: data ?? null,
        isLoading,
        refetch
    }
}

export default useMyReview;