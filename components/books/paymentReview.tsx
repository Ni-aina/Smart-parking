import { Colors } from "@/constants/Colors";
import { getDateFormat, getTimeFormat } from "@/utils/dateTimeAction";
import { Text, useColorScheme, View } from "react-native";

const TextWeight = ({
    text,
}: { text: string }) => {
    const colorscheme = useColorScheme() || "light";

    return (
        <Text
            style={{
                fontSize: 16,
                color: Colors[colorscheme].text,
                fontWeight: "600"
            }}
            numberOfLines={1}
            ellipsizeMode="tail"
        >
            {text}
        </Text>
    )
}

interface PaymentReviewProps {
    lotName: string;
    lotLocation: string;
    startTime: string | Date;
    endTime: string | Date;
    plateNumber: string;
    status: string;
    amount: number | string;
}

const PaymentReview = ({
    lotName,
    lotLocation,
    startTime,
    endTime,
    plateNumber,
    status,
    amount
}: PaymentReviewProps) => {
    const colorscheme = useColorScheme() || "light";

    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 16
            }}
        >
            <View
                style={{
                    width: "50%",
                    gap: 10
                }}
            >
                <View
                    style={{
                        gap: 5
                    }}
                >
                    <Text
                        style={{ color: Colors[colorscheme].icon }}
                    >
                        Name
                    </Text>
                    <TextWeight text={lotName} />
                </View>
                <View
                    style={{
                        gap: 5
                    }}
                >
                    <Text
                        style={{ color: Colors[colorscheme].icon }}
                    >
                        Location
                    </Text>
                    <TextWeight text={lotLocation} />
                </View>
                <View
                    style={{
                        gap: 5
                    }}
                >
                    <Text
                        style={{ color: Colors[colorscheme].icon }}
                    >
                        Arrival Date
                    </Text>
                    <TextWeight
                        text={
                            getDateFormat(new Date(startTime))
                        }
                    />
                </View>
                <View
                    style={{
                        gap: 5
                    }}
                >
                    <Text
                        style={{ color: Colors[colorscheme].icon }}
                    >
                        Arrival Time
                    </Text>
                    <TextWeight
                        text={
                            getTimeFormat(new Date(startTime))
                        }
                    />
                </View>
            </View>
            <View
                style={{
                    width: "50%",
                    gap: 10
                }}
            >
                <View
                    style={{
                        gap: 5
                    }}
                >
                    <Text
                        style={{ color: Colors[colorscheme].icon }}
                    >
                        Vehicle Number
                    </Text>
                    <TextWeight text={plateNumber} />
                </View>
                <View
                    style={{
                        gap: 5
                    }}
                >
                    <Text
                        style={{ color: Colors[colorscheme].icon }}
                    >
                        Payment  Status
                    </Text>
                    <TextWeight text={status} />
                </View>
                <View
                    style={{
                        gap: 5
                    }}
                >
                    <Text
                        style={{ color: Colors[colorscheme].icon }}
                    >
                        Exit Date
                    </Text>
                    <TextWeight
                        text={
                            getDateFormat(new Date(endTime))
                        }
                    />
                </View>
                <View
                    style={{
                        gap: 5
                    }}
                >
                    <Text
                        style={{ color: Colors[colorscheme].icon }}
                    >
                        Exit Time
                    </Text>
                    <TextWeight
                        text={
                            getTimeFormat(new Date(endTime))
                        }
                    />
                </View>
                <View
                    style={{
                        marginTop: 10,
                        gap: 5
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "700",
                            color: Colors[colorscheme].icon
                        }}
                    >
                        Total Payment
                    </Text>
                    <TextWeight text={`$ ${amount}`} />
                </View>
            </View>
        </View>
    )
}

export default PaymentReview;