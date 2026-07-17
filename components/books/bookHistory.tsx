import useBooksHistory from "@/hooks/books/useBooksHistory";
import { FlatList } from "react-native";
import LoaderSkeleton from "../ui/Skeleton";
import BookCard from "./bookCard";

const BookHistory = () => {

    const {
        booksHistory,
        isLoading,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching,
        isFetchingNextPage
    } = useBooksHistory();

    if (isLoading) return <LoaderSkeleton />

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={booksHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookCard reservation={item} />}
            refreshing={isRefetching}
            onRefresh={refetch}
            onEndReached={() => {
                if (hasNextPage) {
                    fetchNextPage();
                }
            }}
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