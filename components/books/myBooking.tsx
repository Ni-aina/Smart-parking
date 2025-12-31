import useReservation from "@/hooks/useReservation";
import { FlatList } from "react-native";
import LoaderSkeleton from "../ui/Skeleton";
import BookCard from "./bookCard";

const MyBooking = () => {
    const {
        reservations,
        isLoading,
        refetch,
        isRefetching
    } = useReservation();

    if (isLoading) return <LoaderSkeleton />

    return (
        <FlatList
            showsVerticalScrollIndicator={false}
            data={reservations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookCard reservation={item} />}
            refreshing={isRefetching}
            onRefresh={refetch}
        />
    )
}

export default MyBooking;