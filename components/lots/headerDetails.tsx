import { Colors } from "@/constants/Colors";
import { Router } from "expo-router";
import { StyleSheet, useColorScheme, View } from "react-native";
import Icons from "../ui/icons";

interface HeaderDetailsInterface {
    router: Router;
    lotImage?: string;
}

const HeaderDetails = ({ router, lotImage }: HeaderDetailsInterface) => {
    const colorScheme = useColorScheme() || "light";

    return (
        <View style={styles.headerBackground}>
            <Icons
                onPress={() => router.back()}
                name="chevron-back"
                color={
                    lotImage ?
                        "white" :
                        Colors[colorScheme].icon
                }
                size={30}
            />
            <Icons
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