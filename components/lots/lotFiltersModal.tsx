import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    useWindowDimensions,
    View
} from "react-native";

export interface LotFilters {
    priceRange?: [number, number]
}

interface LotFiltersModalProps {
    visible: boolean
    filters: LotFilters
    setFilters: (filters: LotFilters) => void
    onClose: () => void
}

const LotFiltersModal = ({ visible, filters, setFilters, onClose }: LotFiltersModalProps) => {
    const { t } = useTranslation()
    const pathname = usePathname();

    const colorScheme = useColorScheme() === "dark" ? "dark" : "light"
    const { height, width } = useWindowDimensions()
    const [minPrice, setMinPrice] = useState(filters.priceRange?.[0]?.toString() ?? "")
    const [maxPrice, setMaxPrice] = useState(filters.priceRange?.[1]?.toString() ?? "")
    const [validationError, setValidationError] = useState("")
    const isCompact = height < 700 || width < 360

    const updatePrice = (minimum: string, maximum: string) => {
        const min = Number(minimum)
        const max = Number(maximum)

        if (!Number.isFinite(min) || !Number.isFinite(max) || min < 0 || max < 0 || min > max) {
            setValidationError(t("invalid_price_range"))
            return
        }

        setValidationError("")
        setFilters({ priceRange: [min, max] })
    }

    const resetFilters = () => {
        setMinPrice("")
        setMaxPrice("")
        setValidationError("")
        setFilters({})
    }

    useEffect(() => {
        resetFilters()
    }, [pathname])

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
                <View style={[styles.sheet, { backgroundColor: Colors[colorScheme].background, height: isCompact ? "58%" : "50%" }]}>
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
                    <View style={styles.section}>
                        <Text style={[styles.label, { color: Colors[colorScheme].text }]}>{t("price_range")}</Text>
                        <View style={[styles.fields, isCompact && styles.fieldsCompact]}>
                            <View style={styles.field}>
                                <Text style={{ color: Colors[colorScheme].text }}>{t("minimum_price")}</Text>
                                <TextInput
                                    accessibilityLabel={t("minimum_price")}
                                    keyboardType="decimal-pad"
                                    placeholder="0"
                                    placeholderTextColor={Colors[colorScheme].icon}
                                    value={minPrice}
                                    onChangeText={value => {
                                        setMinPrice(value)
                                        updatePrice(value, maxPrice)
                                    }}
                                    style={[styles.input, { borderColor: Colors[colorScheme].gray200, color: Colors[colorScheme].text }]}
                                />
                            </View>
                            <View style={styles.field}>
                                <Text style={{ color: Colors[colorScheme].text }}>{t("maximum_price")}</Text>
                                <TextInput
                                    accessibilityLabel={t("maximum_price")}
                                    keyboardType="decimal-pad"
                                    placeholder="10000"
                                    placeholderTextColor={Colors[colorScheme].icon}
                                    value={maxPrice}
                                    onChangeText={value => {
                                        setMaxPrice(value)
                                        updatePrice(minPrice, value)
                                    }}
                                    style={[styles.input, { borderColor: Colors[colorScheme].gray200, color: Colors[colorScheme].text }]}
                                />
                            </View>
                        </View>
                    </View>
                    {!!validationError && <Text style={styles.error}>{validationError}</Text>}
                    <Pressable
                        accessibilityRole="button"
                        onPress={resetFilters}
                        style={[styles.reset, { borderColor: Colors[colorScheme].gray200 }]}
                    >
                        <Ionicons name="refresh-outline" size={18} color={Colors[colorScheme].tint} />
                        <Text style={{ color: Colors[colorScheme].tint }}>{t("reset_filters")}</Text>
                    </Pressable>
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
        padding: 20,
        width: "100%"
    },
    handle: {
        alignSelf: "center",
        borderRadius: 3,
        height: 5,
        marginBottom: 18,
        width: 48
    },
    header: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24
    },
    title: { fontSize: 24, fontWeight: "700" },
    close: {
        alignItems: "center",
        borderRadius: 20,
        height: 40,
        justifyContent: "center",
        width: 40
    },
    section: {
        borderRadius: 18
    },
    label: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 16
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
    input: {
        borderRadius: 10,
        borderWidth: 1,
        fontSize: 16,
        paddingHorizontal: 14,
        paddingVertical: 12
    },
    error: {
        color: "#dd1919",
        marginTop: 8
    },
    reset: {
        alignItems: "center",
        alignSelf: "center",
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: "row",
        gap: 8,
        marginTop: 20,
        paddingHorizontal: 16,
        paddingVertical: 12
    }
})

export default LotFiltersModal;
