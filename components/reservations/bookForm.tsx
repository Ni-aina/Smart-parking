import { Colors } from "@/constants/Colors";
import { useLotStore } from "@/stores/zustand/lot";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    useColorScheme,
    View
} from "react-native";

const BookForm = () => {
    const colorschema = useColorScheme() || "light";
    const [date, setDate] = useState(new Date());

    const {
        lot: {
            startDate,
            arrivalTime,
            durationHours
        },
        setLot
    } = useLotStore();

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
            <DateTimePicker
                value={date}
                onChange={(_, selectedDate)=> {
                    selectedDate && setDate(selectedDate)
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default BookForm;