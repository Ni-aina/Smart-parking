import ProtectedRoute from "@/components/ProtectedRoute";
import Header from "@/components/ui/header";
import { Colors } from "@/constants/Colors";
import { useLocationStore } from "@/stores/zustand/location";
import { getDistanceTime } from "@/utils/getDistanceTime";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, useColorScheme, View } from "react-native";
import { WebView } from "react-native-webview";

type Coordinate = { latitude: number; longitude: number }
type RouteInfo = { distance: string; duration: string; coordinates: Coordinate[] }

const DirectionsScreen = () => {
    const { t } = useTranslation()
    const colorscheme = useColorScheme() === "dark" ? "dark" : "light"
    const router = useRouter()
    const { location: origin, refreshLocation } = useLocationStore()
    const { lat, lng, title } = useLocalSearchParams<{ lat?: string; lng?: string; title?: string }>()
    const destLat = parseFloat(lat || "0"), destLng = parseFloat(lng || "0"), destTitle = title || t("destination")
    const [route, setRoute] = useState<RouteInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState("")
    const hasLoadedRoute = useRef(false)

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
                if (!hasLoadedRoute.current) setLoading(true)
                setErrorMsg("")
                const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destLng},${destLat}?overview=full&geometries=geojson`)
                const data = await res.json()
                if (data.code === "Ok" && data.routes?.length > 0) {
                    const routeData = data.routes[0]
                    const coordinates: Coordinate[] = routeData.geometry.coordinates.map(([routeLng, routeLat]: [number, number]) => ({ latitude: routeLat, longitude: routeLng }))
                    const duration = getDistanceTime(origin.latitude, origin.longitude, destLat, destLng)
                    setRoute({ distance: `${(routeData.distance / 1000).toFixed(1)} km`, duration: duration?.formatted || "", coordinates })
                } else {
                    setErrorMsg(t("route_error"))
                }
            } catch {
                setErrorMsg(t("route_error"))
            } finally {
                if (!hasLoadedRoute.current) {
                    hasLoadedRoute.current = true
                    setLoading(false)
                }
            }
        }
        if (destLat && destLng && origin) initNavigation()
    }, [destLat, destLng, origin, t])

    const mapHtml = useMemo(() => {
        if (!origin || !route) return ""
        const data = JSON.stringify({
            origin,
            destination: { latitude: destLat, longitude: destLng },
            destinationTitle: destTitle,
            currentLocation: t("current_location"),
            coordinates: route.coordinates,
            routeColor: Colors[colorscheme].tint
        }).replace(/</g, "\\u003c")
        const tileFilter = colorscheme === "dark" ? ".leaflet-tile{filter:brightness(.72) invert(.88) hue-rotate(180deg) saturate(.7)}" : ""
        return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>html,body,#map{width:100%;height:100%;margin:0;background:${Colors[colorscheme].background}}${tileFilter}.leaflet-control-attribution{font-size:10px}</style></head><body><div id="map"></div><script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script><script>const data=${data};const map=L.map('map');L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);const points=data.coordinates.map(({latitude,longitude})=>[latitude,longitude]);const line=L.polyline(points,{color:data.routeColor,weight:5,opacity:.9}).addTo(map);L.marker([data.origin.latitude,data.origin.longitude]).addTo(map).bindPopup(data.currentLocation);L.marker([data.destination.latitude,data.destination.longitude]).addTo(map).bindPopup(data.destinationTitle);map.fitBounds(line.getBounds(),{padding:[36,36]});</script></body></html>`
    }, [colorscheme, destLat, destLng, destTitle, origin, route, t])

    const bg = { backgroundColor: Colors[colorscheme].background }
    const txt = { color: Colors[colorscheme].text }
    const iconColor = { color: Colors[colorscheme].icon }
    const cardStyle = { backgroundColor: Colors[colorscheme].background, borderColor: Colors[colorscheme].gray200 }

    return (
        <ProtectedRoute>
            <View style={[styles.container, bg]}>
                <Header title={t("directions")} customBackAction={() => router.canGoBack() ? router.back() : router.replace("/(tabs)/book")} />
                {loading ?
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={Colors[colorscheme].tint} />
                        <Text style={txt}>{t("loading_route")}</Text>
                    </View>
                    :
                    <View style={styles.mapWrapper}>
                        {errorMsg ?
                            <View style={styles.center}><Text style={txt}>{errorMsg}</Text></View>
                            :
                            <>
                                <WebView originWhitelist={["*"]} source={{ html: mapHtml }} style={styles.map} javaScriptEnabled domStorageEnabled />
                                {route &&
                                    <View style={[styles.card, cardStyle]}>
                                        <Text style={[styles.destination, txt]} numberOfLines={1}>{destTitle}</Text>
                                        <View style={styles.row}>
                                            <View style={styles.col}><Text style={iconColor}>{t("distance")}</Text><Text style={txt}>{route.distance}</Text></View>
                                            <View style={styles.col}><Text style={iconColor}>{t("duration")}</Text><Text style={txt}>{route.duration}</Text></View>
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
    container: { flex: 1, paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20, gap: 16 },
    center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
    mapWrapper: { flex: 1, borderRadius: 16, overflow: "hidden", gap: 16 },
    map: { flex: 1, borderRadius: 16 },
    card: { borderWidth: 1, borderRadius: 12, padding: 16, gap: 12 },
    destination: { textAlign: "center", marginBottom: 5 },
    row: { flexDirection: "row", justifyContent: "space-around" },
    col: { alignItems: "center", gap: 4 }
})

export default DirectionsScreen;