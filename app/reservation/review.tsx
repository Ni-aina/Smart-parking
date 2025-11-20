import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import { StyleSheet, View } from "react-native";

const ReviewScreen = () => {

    const handleBook = () => {
      

    }


    return (
        <>
            <View
                style={styles.container}
            >
                <Header
                    title="Review Summary"
                />

                <Button
                    title="Book Now"
                    onPress={handleBook}
                />
            </View>
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 60,
        gap: 20
    }
})

export default ReviewScreen;