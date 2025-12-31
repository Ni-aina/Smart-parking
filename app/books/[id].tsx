import Header from "@/components/ui/header";
import { StyleSheet, Text, View } from "react-native";

const ETicket = () => {

    return (
        <View style={styles.container}>
            <Header
                title="E-Ticket"
            />
            <Text>E-Ticket Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 60,
        gap: 20
    }
})

export default ETicket;