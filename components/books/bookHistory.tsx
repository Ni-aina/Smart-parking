import useBooksHistory from "@/hooks/books/useBooksHistory";
import { useCallback } from "react";
import { FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import NoDataFound from "../NoDataFound";
import RequestTooLong from "../ui/requestTooLong";
import LoaderSkeleton from "../ui/Skeleton";
import BookCard from "./bookCard";

const BookHistory = () => {
    const { t } = useTranslation();

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
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
                <NoDataFound
                    iconName="time-outline"
                    message={t("no_booking_history_yet")}
                />
            }
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
