import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";
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
  const colorScheme = useColorScheme() || "light";

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
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
        backgroundColor={
          colorScheme === "light" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.25)"
        }
      />
      <BlurView
        intensity={25}
        tint={colorScheme === "dark" ? "light" : "dark"}
        style={{
          flex: 1,
          padding: 5
        }}
      >
        <View style={styles.overlay}>
          <View
            style={
              [
                styles.container,
                { backgroundColor: Colors[colorScheme].background }
              ]
            }
          >
            <Text
              style={
                [
                  styles.title,
                  {
                    color: Colors[colorScheme].text

                  }
                ]
              }
            >{title}</Text>
            <Text
              style={
                [
                  styles.message,
                  { color: Colors[colorScheme].icon }
                ]
              }
            >{message}</Text>

            <View style={styles.buttons}>
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: Colors[colorScheme].gray100 },
                  pressed && styles.pressed
                ]}
              >
                <Text
                  style={{
                    color: colorScheme === "light" ? "#000" : "#fff"
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
                  {t("confirm_btn")}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
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
