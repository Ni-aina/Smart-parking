import { createTransaction } from "@/actions/payment.action";
import { createPaymentIntent } from "@/actions/stripe.action";
import Button from "@/components/ui/button";
import ErrorModal from "@/components/ui/errorModal";
import Header from "@/components/ui/header";
import Loading from "@/components/ui/loading";
import { Colors } from "@/constants/Colors";
import useCurrentProfile from "@/hooks/useCurrentProfile";
import { CardField, useStripe } from "@stripe/stripe-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";

const Checkout = () => {
    const colorScheme = useColorScheme() || "light";
    const router = useRouter();

    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pendingPayment, setPendingPayment] = useState(false);

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
        try {
            setPendingPayment(true);

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
                setErrorMessage(error.message)
            } else {
                const transactionId = paymentIntent.id!;

                const newTransaction = await createTransaction({
                    reservationId: id,
                    status: "pending",
                    transactionId,
                    amount
                })

                if (!newTransaction) {
                    setErrorMessage("Failed to create transaction.")
                    return;
                }

                router.push("/(tabs)/book");
            }
        } finally {
            setPendingPayment(false);
        }
    }

    return (
        <>
            <View style={styles.container}>
                <Header
                    title="Checkout"
                />
                <View style={styles.content}>
                    <CardField
                        postalCodeEnabled={false}
                        placeholders={{
                            number: "4242 4242 4242 4242"
                        }}
                        cardStyle={{
                            backgroundColor: colorScheme === "light" ? 
                                Colors.light.background : 
                                Colors.dark.tint,
                            textColor: Colors[colorScheme].text,
                            borderRadius: 5
                        }}
                        style={{
                            width: "100%",
                            height: 50,
                            marginVertical: 10
                        }}
                    />
                    <Button
                        title="Pay Now"
                        onPress={pay}
                    />
                </View>
            </View>
            <ErrorModal
                onClose={
                    () => setErrorMessage(null)
                }
                message={errorMessage || ""}
                visible={errorMessage !== null}
            />
            {
                pendingPayment &&
                <Loading />
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 60,
        gap: 20
    },
    content: {
        flex: 1,
        justifyContent: "space-between",
        gap: 20
    }
})

export default Checkout;