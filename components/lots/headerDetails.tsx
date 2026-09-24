import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { StyleSheet, useColorScheme, View } from "react-native";
import Icons from "../ui/icons";

type Router = ReturnType<typeof useRouter>;

interface HeaderDetailsInterface {
    router: Router;
    lotImage?: string;
    onShare: () => void;
}

const HeaderDetails = ({ router, lotImage, onShare }: HeaderDetailsInterface) => {
    const colorScheme = useColorScheme() === "dark" ? "dark" : "light";

    return (
        <View style={styles.headerBackground}>
            <Icons
                onPress={() => router.push("/(tabs)")}
                name="chevron-back"
                color={
                    lotImage ?
                        "white" :
                        Colors[colorScheme].icon
                }
                size={30}
            />
            <Icons
                onPress={onShare}
                name="share-social-sharp"
                color={
                    lotImage ?
                        "white" :
                        Colors[colorScheme].icon
                }
                size={30}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    headerBackground: {
        flexDirection: "row",
        justifyContent: "space-between"
    }
})

export default HeaderDetails;
