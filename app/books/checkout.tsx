import { createPaymentIntent } from "@/actions/stripe.action";
import Header from "@/components/ui/header";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { useLocalSearchParams } from "expo-router";
import { Button, StyleSheet, View } from "react-native";

const Checkout = () => {

    const {
        id,
        amount: amountString,
    } = useLocalSearchParams<{
        id: string,
        amount: string
    }>();

    const {
        currentProfile
    } = useCurrentProfile();

    const amount = Number.parseFloat(amountString);
    const userId = currentProfile?.id;

    const { confirmPayment } = useStripe();

    const pay = async () => {
        const { clientSecret } = await createPaymentIntent(
            userId!,
            id,
            amount
        )

        const { error, paymentIntent } = await confirmPayment(
            clientSecret,
            {
                paymentMethodType: "Card"
            }
        )

        if (error) {
            console.log(error.message)
        } else {
            console.log("Payment successful:", paymentIntent.id)
        }
    }

    return (
        <View style={styles.container}>
            <Header
                title="Checkout"
            />
            <CardField
                postalCodeEnabled={false}
                placeholders={{
                    number: "4242 4242 4242 4242"
                }}
                cardStyle={{
                    backgroundColor: "#FFFFFF",
                    textColor: "#000000"
                }}
                style={{
                    width: "100%",
                    height: 50,
                    marginVertical: 20
                }}
            />
            <Button title="Pay Now" onPress={pay} />
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

export default Checkout;