import { Colors } from "@/constants/Colors";
import useCategory from "@/hooks/categories/useCategory";
import { Ionicons } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    useWindowDimensions,
    View
} from "react-native";
import SelectInput from "../ui/selectInput";

export interface LotFilters {
    priceRange: [number, number];
    category: string;
}

interface LotFiltersModalProps {
    visible: boolean;
    filters: LotFilters;
    setFilters: Dispatch<SetStateAction<LotFilters>>;
    onClose: () => void;
}

const LotFiltersModal = ({ visible, filters, setFilters, onClose }: LotFiltersModalProps) => {
    const { t } = useTranslation();
    const pathname = usePathname();

    const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
    const { height, width } = useWindowDimensions();

    const [minPrice, setMinPrice] = useState(filters.priceRange?.[0]?.toString() ?? "");
    const [maxPrice, setMaxPrice] = useState(filters.priceRange?.[1]?.toString() ?? "");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(filters.category);
    const [validationError, setValidationError] = useState("");
    const isCompact = height < 700 || width < 360;

    const { categories } = useCategory();

    const selectCategories = categories?.map(item => {
        return {
            id: item.id,
            content: `${item.translations?.at(0)?.displayLabel || ""}, ${item.maxWeightTonnes}t, ↕${item.maxHeightMeters}m`
        }
    })

    const updatePrice = (min: string, max: string) => {
        const minNum = Number(min);
        const maxNum = Number(max);

        if (minNum < 0 || maxNum < 0 || maxNum > 500 || minNum > maxNum) {
            setValidationError(t("invalid_price_range"));
            return;
        }

        setValidationError("");

        setFilters(prev => ({
            ...prev,
            priceRange: [minNum, maxNum]
        }))
    }

    const resetFilters = () => {
        setMinPrice("");
        setMaxPrice("");
        setSelectedCategoryId("");
        setValidationError("");
        setFilters({
            priceRange: [0, 500],
            category: ""
        });
    }

    useEffect(() => {
        setMinPrice(filters.priceRange?.[0]?.toString() ?? "");
        setMaxPrice(filters.priceRange?.[1]?.toString() ?? "");
        setSelectedCategoryId(filters.category);
    }, [visible, filters.priceRange, filters.category]);

    useEffect(() => {
        resetFilters();
    }, [pathname]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.backdrop} onPress={onClose} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboard}
                pointerEvents="box-none"
            >
                <View style={[styles.sheet, { backgroundColor: Colors[colorScheme].background, maxHeight: isCompact ? "80%" : "70%" }]}>
                    <View style={[styles.handle, { backgroundColor: Colors[colorScheme].gray200 }]} />
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>{t("filters")}</Text>
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={t("close")}
                            onPress={onClose}
                            style={[styles.close, { backgroundColor: Colors[colorScheme].gray100 }]}
                        >
                            <Ionicons name="close" size={22} color={Colors[colorScheme].icon} />
                        </Pressable>
                    </View>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={styles.scrollContent}
                    >
                        <View style={styles.section}>
                            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>{t("vehicle_category")}</Text>
                            <SelectInput
                                options={selectCategories || []}
                                value={{
                                    id: selectedCategoryId || "",
                                    content: selectCategories?.find(item => item.id === selectedCategoryId)?.content || ""
                                }}
                                setValue={(value) => {
                                    setSelectedCategoryId(() => categories?.find((item) => item.id === value.id)?.id || "")
                                    setFilters(prev => ({
                                        ...prev,
                                        category: categories?.find((item) => item.id === value.id)?.id || ""
                                    }))
                                }}
                                placeholder={t("select_category")}
                            />
                        </View>

                        <View style={styles.section}>
                            <Text style={[styles.label, { color: Colors[colorScheme].text }]}>{t("price_range")}</Text>
                            <View style={[styles.fields, isCompact && styles.fieldsCompact]}>
                                <View style={styles.field}>
                                    <Text style={[styles.fieldLabel, { color: Colors[colorScheme].text }]}>{t("minimum_price")}</Text>
                                    <TextInput
                                        accessibilityLabel={t("minimum_price")}
                                        keyboardType="decimal-pad"
                                        placeholder="0"
                                        placeholderTextColor={Colors[colorScheme].icon}
                                        value={minPrice}
                                        onChangeText={value => {
                                            setMinPrice(value);
                                            if (!Number(value)) return;
                                            updatePrice(value, maxPrice);
                                        }}
                                        style={[styles.input, { borderColor: Colors[colorScheme].gray200, color: Colors[colorScheme].text }]}
                                    />
                                </View>
                                <View style={styles.field}>
                                    <Text style={[styles.fieldLabel, { color: Colors[colorScheme].text }]}>{t("maximum_price")}</Text>
                                    <TextInput
                                        accessibilityLabel={t("maximum_price")}
                                        keyboardType="decimal-pad"
                                        placeholder="500"
                                        placeholderTextColor={Colors[colorScheme].icon}
                                        value={maxPrice}
                                        onChangeText={value => {
                                            setMaxPrice(value);
                                            if (!Number(value)) return;
                                            updatePrice(minPrice, value);
                                        }}
                                        style={[styles.input, { borderColor: Colors[colorScheme].gray200, color: Colors[colorScheme].text }]}
                                    />
                                </View>
                            </View>
                            {!!validationError && <Text style={styles.error}>{validationError}</Text>}
                        </View>

                        <Pressable
                            accessibilityRole="button"
                            onPress={resetFilters}
                            style={[styles.reset, { borderColor: Colors[colorScheme].gray200 }]}
                        >
                            <Ionicons name="refresh-outline" size={18} color={Colors[colorScheme].tint} />
                            <Text style={{ color: Colors[colorScheme].tint, fontWeight: "600" }}>{t("reset_filters")}</Text>
                        </Pressable>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0, 0, 0, 0.35)"
    },
    keyboard: {
        flex: 1,
        justifyContent: "flex-end"
    },
    sheet: {
        alignSelf: "center",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxWidth: 720,
        paddingHorizontal: 20,
        paddingTop: 16,
        width: "100%"
    },
    handle: {
        alignSelf: "center",
        borderRadius: 3,
        height: 5,
        marginBottom: 16,
        width: 48
    },
    header: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16
    },
    title: {
        fontSize: 24,
        fontWeight: "700"
    },
    close: {
        alignItems: "center",
        borderRadius: 20,
        height: 40,
        justifyContent: "center",
        width: 40
    },
    scrollContent: {
        gap: 20,
        paddingBottom: 28
    },
    section: {
        gap: 12
    },
    label: {
        fontSize: 16,
        fontWeight: "700"
    },
    fields: {
        flexDirection: "row",
        gap: 12
    },
    fieldsCompact: {
        flexDirection: "column"
    },
    field: {
        flex: 1,
        gap: 6
    },
    fieldLabel: {
        fontSize: 14
    },
    input: {
        borderRadius: 10,
        borderWidth: 1,
        fontSize: 16,
        paddingHorizontal: 14,
        paddingVertical: 12
    },
    selectInput: {
        borderRadius: 10,
        borderWidth: 1,
        minHeight: 48,
        paddingHorizontal: 14
    },
    error: {
        color: "#dd1919",
        marginTop: 4
    },
    reset: {
        alignItems: "center",
        alignSelf: "center",
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: "row",
        gap: 8,
        marginTop: 10,
        paddingHorizontal: 16,
        paddingVertical: 12
    }
});

export default LotFiltersModal;
