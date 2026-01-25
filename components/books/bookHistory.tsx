import useBookHistory from "@/hooks/books/useBookHistory";
import { FlatList } from "react-native";
import LoaderSkeleton from "../ui/Skeleton";
import BookCard from "./bookCard";

const BookHistory = () => {

    const {
        booksHistory,
        isLoading,
        refetch,
        isRefetching
    } = useBookHistory();

    if (isLoading) return <LoaderSkeleton />

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={booksHistory}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookCard reservation={item} />}
            refreshing={isRefetching}
            onRefresh={refetch}
        />
    )
}

export default BookHistory;