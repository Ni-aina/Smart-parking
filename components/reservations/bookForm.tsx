import { Colors } from "@/constants/Colors";
import { useLotStore } from "@/stores/zustand/lot";
import { addHours, getDateFormat, getTimeFormat } from "@/utils/dateTimeAction";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    useColorScheme,
    View
} from "react-native";

const BookForm = () => {
    const colorscheme = useColorScheme() || "light";
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const {
        lot,
        setLot
    } = useLotStore();

    const {
        startTime,
        endTime,
        durationHours
    } = lot;

    useEffect(()=> {
        setLot({
            ...lot,
            endTime: addHours(startTime, Number(durationHours))
        })
    }, [startTime, durationHours])

    return (
        <View style={styles.container}>
            <Text
                style={{
                    fontSize: 20,
                    color: Colors[colorscheme].text
                }}
            >
                Start Date
            </Text>
            <Pressable
                style={({ pressed }) => [
                    styles.dateTimePicker,
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
                        Arriving Time
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.dateTimePicker,
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
                        Duration Hours
                    </Text>
                    <TextInput
                        onChangeText={(text) => {
                            setLot({
                                ...lot,
                                durationHours: text
                            })
                        }}
                        value={durationHours}
                        placeholder="Duration in hours"
                        keyboardType="number-pad"
                        style={[
                            styles.dateTimePicker,
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
                Exiting Time
            </Text>
            <View
                style={[
                    styles.dateTimePicker,
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
                        selectedDate && setLot({
                            ...lot,
                            startTime: selectedDate
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
                        selectedTime && setLot({
                            ...lot,
                            startTime: selectedTime
                        })
                        setShowTimePicker(false)
                    }}
                    mode="time"
                    display="spinner"
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 10
    },
    dateTimePicker: {
        flexDirection: "row",
        borderRadius: 5,
        padding: 10,
        borderWidth: 1
    }
})

export default BookForm;