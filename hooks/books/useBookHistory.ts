import { getBooksHistoryByDriverId } from "@/actions/reservation.action";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useCurrentProfile from "../useCurrentProfile";

const useBookHistory = () => {
    const { currentProfile } = useCurrentProfile();
    const driverId = currentProfile?.id || "";

    const {
        data: booksHistory,
        isLoading,
        refetch,
        isRefetching
    } = useQuery({
        queryKey: [`fetch-book-history-${driverId}`],
        queryFn: () => getBooksHistoryByDriverId(driverId)
    })

    useEffect(() => {
        if (isLoading) return;
        
        const booksChannel = supabase.channel(`books:history:${driverId}`)
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
                supabase.removeChannel(booksChannel);
            }
        }, [
            driverId,
            isLoading,
            refetch
        ])

    return {
        booksHistory,
        isLoading,
        refetch,
        isRefetching
    }
}

export default useBookHistory;