import LotFiltersModal, { LotFilters } from "@/components/lots/lotFiltersModal";
import LotItem from "@/components/lots/lotItem";
import LotsSearchHeader from "@/components/lots/lotsSearchHeader";
import NoDataFound from "@/components/NoDataFound";
import RequestTooLong from "@/components/ui/requestTooLong";
import LoaderSkeleton from "@/components/ui/Skeleton";
import useLots from "@/hooks/lots/useLots";
import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    StyleSheet,
    View
} from "react-native";

const FindParkingScreen = () => {
    const router = useRouter();
    const { t } = useTranslation();
    const [layout, setLayout] = useState<"list" | "tile">("list");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filters, setFilters] = useState<LotFilters>({});
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    const {
        debouncedValue: debouncedSearchTerm
    } = useDebounce({
        value: searchTerm,
        delay: 1000
    })

    const { debouncedValue: debouncedFilters } = useDebounce({
        value: filters,
        delay: 500
    })

    const {
        lots,
        isLoading,
        error,
        refetch,
        hasNextPage,
        fetchNextPage,
        isRefetching,
        isFetchingNextPage
    } = useLots({
        searchTerm: debouncedSearchTerm,
        filters: debouncedFilters
    })

    const onEndReached = useCallback(() => {
        if (hasNextPage && !isFetchingNextPage) fetchNextPage()
    }, [
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage
    ])

    const handleShowDetails = (id: string) => {
        router.push(`/lotDetails/${id}`)
    }

    return (
        <View style={styles.container}>
            <LotsSearchHeader
                layout={layout}
                searchTerm={searchTerm}
                onLayoutChange={setLayout}
                onSearchChange={setSearchTerm}
                onShowFilters={() => setIsFilterVisible(true)}
            />
            {
                error ?
                    <RequestTooLong
                        refresh={refetch}
                        message={error.message}
                    />
                    :
                    isLoading ?
                        <LoaderSkeleton /> :
                        <FlatList
                            data={lots}
                            key={layout}
                            numColumns={layout === "list" ? 1 : 2}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) =>
                                <View
                                    style={{
                                        flex: 1 / (layout === "list" ? 1 : 2)
                                    }}
                                >
                                    <LotItem
                                        lot={item}
                                        layout={layout}
                                        onPress={() => handleShowDetails(item.id)}
                                    />
                                </View>
                            }
                            refreshing={isRefetching}
                            onRefresh={refetch}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            columnWrapperStyle={layout === "tile" ? { gap: 10 } : undefined}
                            contentContainerStyle={{ flexGrow: 1 }}
                            ListEmptyComponent={
                                <NoDataFound
                                    iconName="car-outline"
                                    message={t("no_parking_lots_found")}
                                />
                            }
                            showsVerticalScrollIndicator={false}
                            onEndReached={onEndReached}
                            onEndReachedThreshold={0.5}
                            ListFooterComponent={
                                isFetchingNextPage ?
                                    <LoaderSkeleton />
                                    :
                                    null
                            }
                        />
            }
            <LotFiltersModal
                visible={isFilterVisible}
                filters={filters}
                setFilters={setFilters}
                onClose={() => setIsFilterVisible(false)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        gap: 10
    },
})

export default FindParkingScreen;
