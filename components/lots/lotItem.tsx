import { Colors } from "@/constants/Colors";
import { defaultParking } from "@/lib/defaultImages";
import { LotInterface } from "@/types/lot";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Skeleton } from "moti/skeleton";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

interface LotItemInterface {
    lot: LotInterface;
    layout: "list" | "tile";
    onPress: () => void;
}

const LotItem = ({
    lot,
    layout,
    onPress
}: LotItemInterface) => {
    const { t } = useTranslation()
    const colorscheme = useColorScheme() || "light";

    const lotImage = lot.urlImages?.at(0) || null;
    const [loadingImage, setLoadingImage] = useState<boolean>();

    const {
        name,
        location,
        totalSpots,
        occupiedSpots,
        pricePerHour,
        distance
    } = lot;

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                {
                    backgroundColor: Colors[colorscheme].background
                },
                pressed && styles.pressed
            ]}
            onPress={onPress}
        >
            {
                loadingImage &&
                <View>
                    <Skeleton
                        colorMode={colorscheme}
                        width={
                            layout === "tile" ?
                                "100%" :
                                70
                        }
                        height={
                            layout === "tile" ?
                                120 :
                                70
                        }
                    />
                </View>
            }
            <Image
                source={lotImage ? { uri: lotImage } : defaultParking()}
                style={{
                    width: loadingImage ? 0 : (layout === "tile" ? "100%" : 70),
                    height: loadingImage ? 0 : (layout === "tile" ? 120 : 70),
                    borderRadius: 8
                }}
                onLoadStart={() => setLoadingImage(true)}
                onLoadEnd={() => setLoadingImage(false)}
            />
            <View
                style={styles.itemContent}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: Colors[colorscheme].text
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {name}
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: Colors[colorscheme].icon
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {location}
                </Text>
                <View style={styles.relativeContent}>
                    {
                        layout === "list" &&
                        <View style={styles.relativeItems}>
                            <Ionicons
                                name="time-outline"
                                size={20}
                                color={Colors[colorscheme].tint}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: Colors[colorscheme].tabIconDefault
                                }}
                            >
                                {distance?.formatted || t("na")}
                            </Text>
                        </View>
                    }
                    <View style={styles.relativeItems}>
                        <Ionicons
                            name="car-outline"
                            size={20}
                            color={Colors[colorscheme].tint}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                color: Colors[colorscheme].tabIconDefault
                            }}
                        >
                            {totalSpots - occupiedSpots} {t("spots")}
                        </Text>
                    </View>
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorscheme].tint
                        }}
                    >
                        ${pricePerHour} {t("hr")}
                    </Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: "stretch",
        flexDirection: "row",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: 10,
        padding: 10,
        borderRadius: 10
    },
    itemContent: {
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "space-between"
    },
    relativeContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 5
    },
    relativeItems: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    pressed: {
        opacity: 0.8
    }
})

export default LotItem;