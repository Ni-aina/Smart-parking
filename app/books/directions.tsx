import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/ui/header";
import { Colors } from "@/constants/Colors";
import { useLocationStore } from "@/stores/zustand/location";
import { getDistanceTime } from "@/utils/getDistanceTime";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, useColorScheme, View } from "react-native";

import MapView, { Marker, Polyline, PROVIDER_DEFAULT, UrlTile } from "react-native-maps";

type Coordinate = {
    latitude: number
    longitude: number
}

type RouteInfo = {
    distance: string
    duration: string
    coordinates: Coordinate[]
}

const DirectionsScreen = () => {
    const { t } = useTranslation()
    const colorscheme = useColorScheme() === "dark" ? "dark" : "light"

    const router = useRouter()
    const mapRef = useRef<MapView | null>(null)
    const { location: origin, refreshLocation } = useLocationStore()

    const { lat, lng, title } = useLocalSearchParams<{ lat?: string; lng?: string; title?: string }>()
    const destLat = parseFloat(lat || "0"), destLng = parseFloat(lng || "0"), destTitle = title || t("destination")
    const destCoord = {
        latitude: destLat,
        longitude: destLng
    }

    const [route, setRoute] = useState<RouteInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState("")

    useEffect(() => {
        const refreshInterval = setInterval(() => {
            refreshLocation()
        }, 30_000)

        return () => clearInterval(refreshInterval)
    }, [refreshLocation])

    useEffect(() => {
        const initNavigation = async () => {
            if (!origin) return

            try {
                setLoading(true)
                setErrorMsg("")
                const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destLng},${destLat}?overview=full&geometries=geojson`)
                const data = await res.json()
                if (data.code === "Ok" && data.routes?.length > 0) {
                    const r = data.routes[0]
                    const coords: Coordinate[] = r.geometry.coordinates.map(([oLng, oLat]: [number, number]) => {
                        return {
                            latitude: oLat,
                            longitude: oLng
                        }
                    })
                    const duration = getDistanceTime(
                        origin.latitude,
                        origin.longitude,
                        destLat,
                        destLng
                    )
                    setRoute({
                        distance: `${(r.distance / 1000).toFixed(1)} km`,
                        duration: duration?.formatted || "",
                        coordinates: coords
                    })
                    setTimeout(() => {
                        mapRef.current?.fitToCoordinates(coords, {
                            edgePadding: {
                                top: 80,
                                right: 60,
                                bottom: 80,
                                left: 60
                            },
                            animated: true
                        })
                    }, 500)
                } else {
                    setErrorMsg(t("route_error"))
                }
            } catch {
                setErrorMsg(t("route_error"))
            } finally {
                setLoading(false)
            }
        }
        if (destLat && destLng && origin) initNavigation()
    }, [destLat, destLng, origin, t])

    const initialRegion = {
        latitude: origin?.latitude || destLat,
        longitude: origin?.longitude || destLng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05
    }

    const bg = {
        backgroundColor: Colors[colorscheme].background
    }

    const txt = {
        color: Colors[colorscheme].text
    }

    const iconColor = {
        color: Colors[colorscheme].icon
    }

    const cardStyle = {
        backgroundColor: Colors[colorscheme].background,
        borderColor: Colors[colorscheme].gray200
    }

    return (
        <ProtectedRoute>
            <View style={[styles.container, bg]}>
                <Header
                    title={t("directions")}
                    customBackAction={() => router.canGoBack() ? router.back() : router.replace("/(tabs)/book")}
                />
                {loading ?
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={Colors[colorscheme].tint} />
                        <Text style={txt}>{t("loading_route")}</Text>
                    </View>
                    :
                    <View style={styles.mapWrapper}>
                        {errorMsg ?
                            <View style={styles.center}>
                                <Text style={txt}>{errorMsg}</Text>
                            </View>
                            :
                            <>
                                <MapView ref={mapRef} provider={PROVIDER_DEFAULT} style={{ flex: 1, borderRadius: 16 }} initialRegion={initialRegion}>
                                    <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" maximumZ={19} />
                                    {origin &&
                                        <Marker coordinate={origin} title={t("current_location")} />
                                    }
                                    <Marker coordinate={destCoord} title={destTitle} />
                                    {route && route.coordinates.length > 0 &&
                                        <Polyline coordinates={route.coordinates} strokeColor={Colors[colorscheme].tint} strokeWidth={4} />
                                    }
                                </MapView>
                                {route &&
                                    <View style={[styles.card, cardStyle]}>
                                        <Text
                                            style={{
                                                textAlign: "center",
                                                marginBottom: 5,
                                                ...txt
                                            }}
                                            numberOfLines={1}
                                        >
                                            {destTitle}
                                        </Text>
                                        <View style={styles.row}>
                                            <View style={styles.col}>
                                                <Text style={iconColor}>{t("distance")}</Text>
                                                <Text style={txt}>{route.distance}</Text>
                                            </View>
                                            <View style={styles.col}>
                                                <Text style={iconColor}>{t("duration")}</Text>
                                                <Text style={txt}>{route.duration}</Text>
                                            </View>
                                        </View>
                                    </View>
                                }
                            </>
                        }
                    </View>
                }
            </View>
        </ProtectedRoute>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
        gap: 16
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 12
    },
    mapWrapper: {
        flex: 1,
        borderRadius: 16,
        overflow: "hidden",
        gap: 16
    },
    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        gap: 12
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    col: {
        alignItems: "center",
        gap: 4
    }
})

export default DirectionsScreen;
