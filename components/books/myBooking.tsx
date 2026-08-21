import useReservations from "@/hooks/books/useReservations";
import { useCallback } from "react";
import { FlatList } from "react-native";
import RequestTooLong from "../ui/requestTooLong";
import LoaderSkeleton from "../ui/Skeleton";
import BookCard from "./bookCard";

const MyBooking = () => {

    const {
        reservations,
        error,
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

    if (error) return <RequestTooLong refresh={refetch} message={error.message} />

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