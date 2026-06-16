import { getReviewsByLot } from "@/actions/review.action";
import { ReviewInterface } from "@/types/review";
import { useQuery } from "@tanstack/react-query";

const useReviews = ({ lotId }: { lotId: number }) => {

    const { data, isLoading, refetch, isRefetching } = useQuery<ReviewInterface[]>({
        queryKey: ["reviews", lotId],
        queryFn: () => getReviewsByLot(lotId),
        enabled: !!lotId
    })

    return {
        reviews: data ?? [],
        isLoading,
        refetch,
        isRefetching
    }
}

export default useReviews;