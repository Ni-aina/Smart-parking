import BookForm from "@/components/reservations/bookForm";
import Button from "@/components/ui/button";
import Header from "@/components/ui/header";
import { StyleSheet, View } from "react-native";

const BookDetails = () => {

    const handleContinue = () => {

    }

    return (
        <View
            style={styles.container}
        >
            <Header
                title="Book Details"
            />
            <BookForm />
            <Button
                title="Continue"
                onPress={handleContinue}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 40,
        gap: 20
    }
})

export default BookDetails;