import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";
import Header from "../ui/header";

interface LotsSearchHeaderProps {
    layout: "list" | "tile"
    searchTerm: string
    onLayoutChange: (layout: "list" | "tile") => void
    onSearchChange: (value: string) => void
    onShowFilters: () => void
}

const LotsSearchHeader = ({
    layout,
    searchTerm,
    onLayoutChange,
    onSearchChange,
    onShowFilters
}: LotsSearchHeaderProps) => {
    const { t } = useTranslation()
    const router = useRouter()
    const colorScheme = useColorScheme() === "dark" ? "dark" : "light"

    return (
        <>
            <Header
                title={t("search")}
                rightIcon={
                    <View style={styles.layoutToggle}>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => onLayoutChange("list")}
                        >
                            <Ionicons
                                name="reorder-four"
                                size={28}
                                color={layout === "list" ? Colors[colorScheme].tint : Colors[colorScheme].icon}
                            />
                        </Pressable>
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => onLayoutChange("tile")}
                        >
                            <Ionicons
                                name="grid-outline"
                                size={24}
                                color={layout === "tile" ? Colors[colorScheme].tint : Colors[colorScheme].icon}
                            />
                        </Pressable>
                    </View>
                }
                customBackAction={() => router.replace("/home")}
            />
            <View
                style={[
                    styles.inputSearch,
                    {
                        borderColor: Colors[colorScheme].icon,
                        backgroundColor: Colors[colorScheme].background
                    }
                ]}
            >
                <Ionicons name="search" size={20} color={Colors[colorScheme].icon} />
                <TextInput
                    accessibilityLabel={t("search")}
                    style={[styles.inputSearchText, { color: Colors[colorScheme].icon }]}
                    placeholderTextColor={Colors[colorScheme].icon}
                    placeholder={t("search")}
                    value={searchTerm}
                    onChangeText={onSearchChange}
                />
            </View>
            <View style={styles.filterContent}>
                <Text style={[styles.resultText, { color: Colors[colorScheme].text }]}>
                    {t("search_result")}
                </Text>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t("filters")}
                    onPress={onShowFilters}
                    style={styles.filterButton}
                >
                    <Ionicons name="options-outline" size={20} color={Colors[colorScheme].tint} />
                    <Text style={[styles.filterText, { color: Colors[colorScheme].tint }]}>
                        {t("filters")}
                    </Text>
                </Pressable>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    layoutToggle: {
        alignItems: "center",
        flexDirection: "row",
        gap: 5,
        justifyContent: "flex-end"
    },
    inputSearch: {
        alignItems: "center",
        borderRadius: 8,
        flexDirection: "row",
        gap: 5,
        paddingHorizontal: 8
    },
    inputSearchText: {
        fontSize: 16,
        fontWeight: "semibold",
        outlineWidth: 0,
        width: "100%"
    },
    filterContent: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    resultText: {
        fontSize: 20,
        fontWeight: "500"
    },
    filterButton: {
        alignItems: "center",
        flexDirection: "row",
        gap: 5,
        padding: 4
    },
    filterText: {
        fontSize: 16,
        fontWeight: "600"
    }
})

export default LotsSearchHeader;
