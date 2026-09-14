import useReservations from "@/hooks/books/useReservations";
import { useCallback } from "react";
import { FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import NoDataFound from "../NoDataFound";
import RequestTooLong from "../ui/requestTooLong";
import LoaderSkeleton from "../ui/Skeleton";
import BookCard from "./bookCard";

const MyBooking = () => {
    const { t } = useTranslation();

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
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={
                <NoDataFound
                    iconName="calendar-outline"
                    message={t("no_bookings_yet")}
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

export default MyBooking;
