import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    useColorScheme
} from "react-native";

export type SelectInputValue = {
    id: string | number;
    content: string;
}

interface SelectInputProps {
    options: SelectInputValue[];
    value?: SelectInputValue | null;
    setValue: (value: SelectInputValue) => void;
    placeholder?: string;
    disabled?: boolean;
}

const getOptionLabel = (option: SelectInputValue) => option.content;

const SelectInput = ({
    options,
    value,
    setValue,
    placeholder = "Select an option",
    disabled = false
}: SelectInputProps) => {
    const colorScheme = useColorScheme() === "dark" ? "dark" : "light";
    const [visible, setVisible] = useState(false);
    const selectedLabel = value ? getOptionLabel(value) : "";

    const selectOption = (option: SelectInputValue) => {
        setValue(option);
        setVisible(false);
    }

    return (
        <>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={selectedLabel || placeholder}
                accessibilityState={{ disabled, expanded: visible }}
                disabled={disabled}
                onPress={() => setVisible(true)}
                style={({ pressed }) => [
                    styles.input,
                    {
                        borderColor: Colors[colorScheme].text,
                        opacity: disabled ? 0.55 : pressed ? 0.8 : 1
                    }
                ]}
            >
                <Text
                    numberOfLines={1}
                    style={{ color: selectedLabel ? Colors[colorScheme].text : Colors[colorScheme].icon, flex: 1 }}
                >
                    {selectedLabel || placeholder}
                </Text>
                <Ionicons name="chevron-down" size={16} color={Colors[colorScheme].text} />
            </Pressable>

            <Modal
                transparent
                animationType="fade"
                visible={visible}
                onRequestClose={() => setVisible(false)}
            >
                <Pressable style={styles.backdrop} onPress={() => setVisible(false)}>
                    <Pressable
                        accessibilityViewIsModal
                        onPress={() => undefined}
                        style={[styles.menu, { backgroundColor: Colors[colorScheme].background }]}
                    >
                        <FlatList
                            data={options}
                            keyExtractor={(option) => String(option.id)}
                            renderItem={({ item }) => {
                                const selected = value?.id === item.id;

                                return (
                                    <Pressable
                                        accessibilityRole="button"
                                        accessibilityState={{ selected }}
                                        onPress={() => selectOption(item)}
                                        style={({ pressed }) => [
                                            styles.option,
                                            {
                                                backgroundColor: selected ? Colors[colorScheme].gray200 : "transparent",
                                                opacity: pressed ? 0.75 : 1
                                            }
                                        ]}
                                    >
                                        <Text style={[styles.optionText, { color: Colors[colorScheme].text }]}>
                                            {getOptionLabel(item)}
                                        </Text>
                                        {selected && <Ionicons name="checkmark" size={20} color={Colors[colorScheme].tint} />}
                                    </Pressable>
                                );
                            }}
                            ListEmptyComponent={
                                <Text style={[styles.emptyText, { color: Colors[colorScheme].icon }]}>No options available</Text>
                            }
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        alignItems: "center",
        borderRadius: 5,
        borderWidth: 0.5,
        flexDirection: "row",
        gap: 10,
        minHeight: 42,
        paddingHorizontal: 8
    },
    backdrop: {
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        flex: 1,
        justifyContent: "center",
        padding: 24
    },
    menu: {
        borderRadius: 8,
        maxHeight: "100%",
        overflow: "scroll",
        width: "100%"
    },
    option: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: 52,
        paddingHorizontal: 16,
        paddingVertical: 12
    },
    optionText: {
        flex: 1,
        fontSize: 16
    },
    emptyText: {
        padding: 20,
        textAlign: "center"
    }
})

export default SelectInput;
