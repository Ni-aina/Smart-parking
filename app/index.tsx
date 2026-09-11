import SliderRender from "@/components/SliderRender";
import Button from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { sliders } from "@/data/sliders";
import { sliderType } from "@/types/slider";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get("window");

const AppScreen = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
    const carouselRef = useRef<ICarouselInstance | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.skipContent}>
                    <Pressable
                        style={({ pressed }) => [pressed && styles.pressed]}
                        onPress={() => router.navigate("/home")}
                    >
                        <Text style={[styles.skipText, { color: Colors[colorScheme].tint }]}>
                            {t("skip")}
                        </Text>
                    </Pressable>
                </View>
                <Carousel
                    ref={carouselRef}
                    width={width}
                    height={height * 0.60}
                    data={sliders as sliderType[]}
                    renderItem={({ item }) => <SliderRender item={item} />}
                    onProgressChange={(_, absoluteProgress) => {
                        if (absoluteProgress > 2.5) return setCurrentIndex(0);
                        const index = Math.round(absoluteProgress);
                        setCurrentIndex(index);
                    }}
                    scrollAnimationDuration={1000}
                    autoPlayInterval={3000}
                    autoPlay
                />
                <View style={styles.bullets}>
                    {
                        sliders.map((_, index) => (
                            <View
                                key={index}
                                style={[styles.bullet, {
                                    backgroundColor: currentIndex === index ?
                                        Colors[colorScheme].tint :
                                        Colors[colorScheme].icon
                                }]}
                            />
                        ))
                    }
                </View>
                <Button
                    title={t("next")}
                    onPress={() => {
                        if (currentIndex === sliders.length - 1)
                            return router.navigate("/home");
                        carouselRef.current?.next();
                    }}
                />
            </View>
            <StatusBar style="dark" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    content: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        padding: 30
    },
    skipContent: {
        alignSelf: "stretch",
        alignItems: "flex-end",
        marginRight: 30
    },
    pressed: {
        opacity: 0.7
    },
    skipText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    bullets: {
        flexDirection: "row",
        marginBottom: 10,
        gap: 10
    },
    bullet: {
        width: 10,
        height: 10,
        borderRadius: 80
    }
})

export default AppScreen;