import { Colors } from "@/constants/Colors";
import { LotInterface } from "@/types/lot";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";

interface LotItemInterface {
    lot: LotInterface;
    layout: "list" | "tile";
    onPress: ()=> void;
}

const LotItem = ({
    lot,
    layout,
    onPress
}: LotItemInterface) => {
    const colorSchema = useColorScheme() || "light";

    const defaultParking = require("@/assets/images/default-parking.png");
    const lotImage = lot.urlImages?.at(0) || null;

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
                    backgroundColor: Colors[colorSchema].background
                },
                pressed && styles.pressed
            ]}
            onPress={onPress}
        >
            <Image
                source={lotImage ? { uri: lotImage } : defaultParking}
                style={{
                    width: layout === "tile" ? "100%" : 70,
                    height: layout === "tile" ? 120 : 70,
                    borderRadius: 8
                }}
            />
            <View
                style={styles.itemContent}
            >
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: Colors[colorSchema].text
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {name}
                </Text>
                <Text
                    style={{
                        fontSize: 14,
                        color: Colors[colorSchema].icon
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
                                color={Colors[colorSchema].tint}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: Colors[colorSchema].tabIconDefault
                                }}
                            >
                               {distance?.formatted || "N/A"}
                            </Text>
                        </View>
                    }
                    <View style={styles.relativeItems}>
                        <Ionicons
                            name="car-outline"
                            size={20}
                            color={Colors[colorSchema].tint}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                color: Colors[colorSchema].tabIconDefault
                            }}
                        >
                            {totalSpots - occupiedSpots} Spots
                        </Text>
                    </View>
                    <Text
                        style={{
                            fontSize: 16,
                            color: Colors[colorSchema].tint
                        }}
                    >
                        ${pricePerHour} hr
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
        gap: 5,
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