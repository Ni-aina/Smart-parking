import useReservations from "@/hooks/books/useReservations";
import { useCallback } from "react";
import { FlatList } from "react-native";
import LoaderSkeleton from "../ui/Skeleton";
import BookCard from "./bookCard";

const MyBooking = () => {

    const {
        reservations,
        isLoading,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching,
        isFetchingNextPage
    } = useReservations();

    const onEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage()
    }, [
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    ])

    if (isLoading) return <LoaderSkeleton />

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={reservations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookCard reservation={item} />}
            refreshing={isRefetching}
            onRefresh={refetch}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
                isFetchingNextPage ?
                    <LoaderSkeleton />
                    :
                    null
            }
        />
    )
}

export default MyBooking;