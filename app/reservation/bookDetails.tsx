import Header from "@/components/ui/header";
import { StyleSheet, View } from "react-native";

const BookDetails = () => {

    return (
        <View
            style={styles.container}
        >
            <Header
                title="Book Details"
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
        gap: 20
    }
})

export default BookDetails;