import { Colors } from "@/constants/Colors";
import * as NavigationBar from 'expo-navigation-bar';
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from "react-native";

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  const { t } = useTranslation()
  const colorscheme = useColorScheme() || "light";

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, [])

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
    >
      <StatusBar
        barStyle={colorscheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor="rgba(0,0,0,0.1)"
      />
      <View style={styles.overlay}>
        <View
          style={
            [
              styles.container,
              { backgroundColor: Colors[colorscheme].background }
            ]
          }
        >
          <Text
            style={
              [
                styles.title,
                {
                  color: Colors[colorscheme].text

                }
              ]
            }
          >{title}</Text>
          <Text
            style={
              [
                styles.message,
                { color: Colors[colorscheme].icon }
              ]
            }
          >{message}</Text>

          <View style={styles.buttons}>
            <Pressable
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: Colors[colorscheme].gray100 },
                pressed && styles.pressed
              ]}
            >
              <Text
                style={{
                  color: colorscheme === "light" ? "#000" : "#fff"
                }}
              >
                {t("cancel_btn")}
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: "#dd1919ff" },
                pressed && styles.pressed
              ]}
            >
              <Text
                style={{
                  color: "white"
                }}
              >
                {t("delete_btn")}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000014",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    width: "80%",
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  message: {
    fontSize: 16,
    marginBottom: 20
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5
  },
  pressed: {
    opacity: 0.7
  }
})

export default ConfirmModal;
