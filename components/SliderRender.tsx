import { Colors } from "@/constants/Colors";
import { sliderType } from "@/types/slider";
import { useTranslation } from "react-i18next";
import { Dimensions, Image, StyleSheet, Text, useColorScheme, View } from "react-native";

interface SliderRenderProps {
    item: sliderType
}

const SliderRender = ({ item: {
    title, description, image
} }: SliderRenderProps) => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme() || "light";
    
    return (
        <View style={styles.container}>
            <Image
                source={image}
                style={styles.image}
                alt={t(title)}
            />
            <View style={styles.content}>
                <Text style={[styles.title, { color: Colors[colorScheme].text }]}>
                    {t(title)}
                </Text>
                <Text style={[ styles.description, { color: Colors[colorScheme].icon }]}>
                    {t(description)}
                </Text>
            </View>
        </View>
    )
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        rowGap: 40
    },
    image: {
        width: width * 0.65,
        height: height * 0.21,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 20
    },
    title: {
        fontSize: 24,
        maxWidth: '80%',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    description: {
        fontSize: 16,
        textAlign: 'justify'
    }
})
 
export default SliderRender;