import SliderRender from "@/components/SliderRender";
import Button from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import { sliders } from "@/data/sliders";
import { sliderType } from "@/types/slider";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get("window");

const AppScreen = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() || "light";
    const carouselRef = useRef<ICarouselInstance | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Pressable 
                style={({ pressed }) => [styles.skipContent, pressed && styles.pressed]} 
                onPress={() => router.navigate("/home")}
            >
                <Text style={[styles.skipText, { color: Colors[colorScheme].tint }]}>
                    {t("skip")}
                </Text>
            </Pressable>
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
            <View style={styles.buttonStyle}>
                <Button
                    title={t("next")}
                    onPress={() =>{
                        if (currentIndex === sliders.length - 1)
                            return router.navigate("/home");
                        carouselRef.current?.next();
                    }}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    pressed: {
        opacity: 0.7
    },
    skipContent: {
        position: 'absolute',
        top: 50,
        right: 30,
        padding: 10
    },
    skipText: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    bullets: {
        flexDirection: "row", 
        gap: 10
    },
    bullet: {
        width: 10,
        height: 10,
        borderRadius: 80
    },
    buttonStyle: {
        position: 'absolute',
        bottom: 80
    }
})

export default AppScreen;