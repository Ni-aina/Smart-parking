import { Colors } from "@/constants/Colors";
import useDebounce from "@/hooks/useDebounce";
import { LotStateInterface } from "@/types/lot";
import { addHours, getDateFormat, getTimeFormat } from "@/utils/dateTimeAction";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";
import ErrorModal from "../ui/errorModal";

interface BookFormProps {
    availableSpots: number;
    lot: LotStateInterface;
    setLot: (lot: LotStateInterface) => void;
}

const BookForm = ({
    availableSpots,
    lot,
    setLot
}: BookFormProps) => {

    const { t } = useTranslation()
    const colorscheme = useColorScheme() || "light";
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const [timeError, setTimeError] = useState<string | null>(null);

    const {
        startTime,
        endTime,
        durationHours
    } = lot;

    const {
        debouncedValue: durationDebounce
    } = useDebounce({
        value: durationHours,
        delay: 500
    })

    useEffect(() => {
        setLot({
            ...lot,
            endTime: addHours(startTime, Number(durationDebounce))
        })
    }, [
        startTime,
        durationDebounce
    ])

    useEffect(()=> {
        if (!timeError) return
        const timer = setTimeout(() => {
            setTimeError(null)
        }, 3000)
        return () => clearTimeout(timer)
    }, [timeError])

    return (
        <View style={styles.container}>
            <View
                style={{
                    flexDirection: "row",
                    gap: 10
                }}
            >
                <View
                    style={{
                        width: "50%",
                        gap: 10
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            color: Colors[colorscheme].text
                        }}
                    >
                        {t("start_date")}
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.input,
                            {
                                borderColor: Colors[colorscheme].gray200,
                                opacity: pressed ? 0.8 : 1
                            }
                        ]}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    color: Colors[colorscheme].icon
                                }}
                            >
                                {getDateFormat(startTime)}
                            </Text>
                        </View>
                        <Ionicons
                            size={16}
                            name="calendar"
                            color={Colors[colorscheme].icon}
                        />
                    </Pressable>
                </View>
                <View
                    style={{
                        width: "50%",
                        gap: 10
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            color: Colors[colorscheme].text
                        }}
                    >
                        {t("available_spots")}
                    </Text>
                    <View
                        style={[
                            styles.input,
                            {
                                borderColor: Colors[colorscheme].gray200
                            }
                        ]}
                    >
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    color: Colors[colorscheme].icon
                                }}
                            >
                                {availableSpots}
                            </Text>
                        </View>
                        <Ionicons
                            size={16}
                            name="car"
                            color={Colors[colorscheme].icon}
                        />
                    </View>
                </View>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 10
                }}
            >
                <View
                    style={{
                        width: "50%",
                        gap: 10
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            color: Colors[colorscheme].text
                        }}
                    >
                        {t("arriving_time")}
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.input,
                            {
                                borderColor: Colors[colorscheme].gray200,
                                opacity: pressed ? 0.8 : 1
                            }
                        ]}
                        onPress={() => setShowTimePicker(true)}
                    >
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    color: Colors[colorscheme].icon
                                }}
                            >
                                {getTimeFormat(startTime)}
                            </Text>
                        </View>
                        <Ionicons
                            size={16}
                            name="timer"
                            color={Colors[colorscheme].icon}
                        />
                    </Pressable>
                </View>
                <View
                    style={{
                        width: "50%",
                        gap: 10
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            color: Colors[colorscheme].text
                        }}
                    >
                        {t("duration_hours_label")}
                    </Text>
                    <TextInput
                        onChangeText={(text) => {
                            const duration = Math.round(Number(text)) || "";
                            if (+duration < 0 || +duration > 10000) return;
                            setLot({
                                ...lot,
                                durationHours: duration.toString()
                            })
                        }}
                        value={durationHours}
                        placeholder={t("duration_hours_placeholder")}
                        keyboardType="number-pad"
                        style={[
                            styles.input,
                            {
                                color: Colors[colorscheme].text,
                                borderColor: Colors[colorscheme].gray200
                            }
                        ]}
                    />
                </View>
            </View>
            <Text
                style={{
                    fontSize: 20,
                    color: Colors[colorscheme].text
                }}
            >
                {t("exiting_time")}
            </Text>
            <View
                style={[
                    styles.input,
                    {
                        borderColor: Colors[colorscheme].gray200
                    }
                ]}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            color: Colors[colorscheme].icon
                        }}
                    >
                        {getDateFormat(endTime)} {getTimeFormat(endTime)}
                    </Text>
                </View>
                <Ionicons
                    size={16}
                    name="exit-outline"
                    color={Colors[colorscheme].icon}
                />
            </View>
            {
                showDatePicker &&
                <DateTimePicker
                    value={startTime}
                    onChange={(_, selectedDate) => {
                        if (!selectedDate) {
                            setTimeError(t("book_time_error"))
                            return setShowDatePicker(false)
                        }

                        const now = new Date()

                        const year = selectedDate.getFullYear()
                        const month = selectedDate.getMonth()
                        const date = selectedDate.getDate()

                        const hours = now.getHours()
                        const minutes = now.getMinutes()

                        setLot({
                            ...lot,
                            startTime: new Date(year, month, date, hours, minutes)
                        })
                        setShowDatePicker(false)
                    }}
                    minimumDate={new Date()}
                    display="spinner"
                />
            }
            {
                showTimePicker &&
                <DateTimePicker
                    value={startTime}
                    onChange={(_, selectedTime) => {
                        const timeMinusFiveMinutes = new Date()
                        timeMinusFiveMinutes.setMinutes(timeMinusFiveMinutes.getMinutes() - 5)
                        if (!selectedTime || selectedTime < timeMinusFiveMinutes) {
                            setTimeError(t("book_time_error"))
                            return setShowTimePicker(false)
                        }

                        setLot({
                            ...lot,
                            startTime: selectedTime
                        })

                        setShowTimePicker(false)
                    }}
                    mode="time"
                    display="spinner"
                />
            }
            <ErrorModal
                visible={!!timeError}
                onClose={() => setTimeError(null)}
                message={timeError!}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10
    },
    input: {
        flexDirection: "row",
        borderRadius: 5,
        padding: 10,
        borderWidth: 1
    }
})

export default BookForm;