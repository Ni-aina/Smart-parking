import { Colors } from "@/constants/Colors";
import { getDateFormat, getTimeFormat } from "@/utils/dateTimeAction";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
                        {t("name")}
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
                        {t("location")}
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
                        {t("arrival_date")}
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
                        {t("arrival_time")}
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
                        {t("vehicle_number")}
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
                        {t("payment_status")}
                    </Text>
                    <TextWeight text={t(`status_${status.toLowerCase()}`, { defaultValue: status })} />
                </View>
                <View
                    style={{
                        gap: 5
                    }}
                >
                    <Text
                        style={{ color: Colors[colorscheme].icon }}
                    >
                        {t("exit_date")}
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
                        {t("exit_time")}
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
                        {t("total_payment")}
                    </Text>
                    <TextWeight text={`$ ${amount}`} />
                </View>
            </View>
        </View>
    )
}

export default PaymentReview;