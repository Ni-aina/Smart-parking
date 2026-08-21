import useBooksHistory from "@/hooks/books/useBooksHistory";
import { useCallback } from "react";
import { FlatList } from "react-native";
import RequestTooLong from "../ui/requestTooLong";
import LoaderSkeleton from "../ui/Skeleton";
import BookCard from "./bookCard";

const BookHistory = () => {

    const {
        booksHistory,
        error,
        isLoading,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching,
        isFetchingNextPage
    } = useBooksHistory();

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
            data={booksHistory}
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

export default BookHistory;