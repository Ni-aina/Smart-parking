import LotItem from "@/components/lots/lotItem";
import Header from "@/components/ui/header";
import RequestTooLong from "@/components/ui/requestTooLong";
import LoaderSkeleton from "@/components/ui/Skeleton";
import { Colors } from "@/constants/Colors";
import useLots from "@/hooks/useLots";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";

const FindParkingScreen = () => {
    const router = useRouter();

    const { t } = useTranslation();
    const colorSchema = useColorScheme() || "light";
    const [layout, setLayout] = useState<"list" | "tile">("list");

    const {
        lots,
        isPending,
        error,
        refetch,
        isRefetching
    } = useLots();

    const handleShowDetails = (id: string) => {
        router.push(`/lotDetails/${id}`)
    }

    return (
        <View style={styles.container}>
            <Header
                title="Search"
                rightIcon={
                    <View style={styles.layoutToggle}>
                        <Pressable
                            onPress={() => setLayout("list")}
                        >
                            <Ionicons
                                name="reorder-four"
                                size={28}
                                color={layout === "list" ?
                                    Colors[colorSchema].tint :
                                    Colors[colorSchema].icon
                                }
                            />
                        </Pressable>

                        <Pressable
                            onPress={() => setLayout("tile")}
                        >
                            <Ionicons
                                name="grid-outline"
                                size={24}
                                color={layout === "tile" ?
                                    Colors[colorSchema].tint :
                                    Colors[colorSchema].icon
                                }
                            />
                        </Pressable>
                    </View>
                }
            />
            <View
                style={[
                    styles.inputSearch,
                    {
                        borderColor: Colors[colorSchema].icon,
                        backgroundColor: Colors[colorSchema].background
                    }
                ]}
            >
                <Ionicons
                    name="search"
                    size={20}
                    color={Colors[colorSchema].icon}
                />
                <TextInput
                    style={[
                        styles.inputSearchText,
                        {
                            color: Colors[colorSchema].icon,
                        }
                    ]}
                    placeholderTextColor={Colors[colorSchema].icon}
                    placeholder="Search"
                />
            </View>
            <View style={styles.filterContent}>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "500",
                        color: Colors[colorSchema].text
                    }}
                >
                    Search Result
                </Text>
                <Text
                    style={{
                        fontSize: 20,
                        color: Colors[colorSchema].tint
                    }}
                >
                    Filters
                </Text>
            </View>
            {
                error ?
                    <RequestTooLong
                        refresh={refetch}
                        message={error.message}
                    />
                    :
                    isPending ?
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
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            columnWrapperStyle={layout === "tile" ? { gap: 10 } : undefined}
                            showsVerticalScrollIndicator={false}
                            refreshing={isRefetching}
                            onRefresh={refetch}
                        />
            }
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
    layoutToggle: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 5
    },
    headerText: {
        fontSize: 20,
        fontWeight: "semibold"
    },
    inputSearch: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        gap: 5,
        borderRadius: 8
    },
    inputSearchText: {
        width: "100%",
        fontSize: 16,
        fontWeight: "semibold",
        outlineWidth: 0
    },
    filterContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    }
})

export default FindParkingScreen;