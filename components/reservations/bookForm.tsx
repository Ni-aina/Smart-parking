import { Colors } from "@/constants/Colors";
import { useLotStore } from "@/stores/zustand/lot";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

const BookForm = () => {
    const colorschema = useColorScheme() || "light";
    const [showDatePicker, setShowDatePicker] = useState(false);

    const {
        lot,
        setLot
    } = useLotStore();

    const {
        startDate,
        arrivalTime,
        durationHours
    } = lot;

    return (
        <View style={styles.container}>
            <Text
                style={{
                    fontSize: 20,
                    color: Colors[colorschema].text
                }}
            >
                Start Date
            </Text>
            <Pressable
                style={({ pressed }) => [
                    styles.datePicker,
                    {
                        borderColor: Colors[colorschema].gray200,
                        opacity: pressed ? 0.8 : 1
                    }
                ]}
                onPress={() => setShowDatePicker(true)}
            >
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            color: Colors[colorschema].icon
                        }}
                    >
                        {startDate.toDateString()}
                    </Text>
                </View>
                <Ionicons
                    size={16}
                    name="calendar"
                    color={Colors[colorschema].icon}
                />
            </Pressable>
            {
                showDatePicker &&
                <DateTimePicker
                    value={startDate}
                    onChange={(_, selectedDate) => {
                        selectedDate && setLot({
                            ...lot,
                            startDate: selectedDate
                        })
                        setShowDatePicker(false)
                    }}
                    minimumDate={new Date()}
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
    datePicker: {
        flexDirection: "row",
        borderRadius: 5,
        padding: 10,
        borderWidth: 1
    }
})

export default BookForm;