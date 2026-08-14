import Button from "@/components/ui/button";
import { Colors } from "@/constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  useColorScheme,
  View
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp
} from "react-native-reanimated";

const NotFoundScreen = () => {
  const {
    t
  } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false
        }}
      />
      <View
        style={[
          styles.container,
          {
            backgroundColor: Colors[colorScheme].background
          }
        ]}
      >
        <View style={styles.content}>
          <Animated.View
            entering={FadeInUp.delay(100).springify()}
            style={[
              styles.card,
              {
                backgroundColor: Colors[colorScheme].background,
                borderColor: Colors[colorScheme].gray200
              }
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: Colors[colorScheme].tint,
                  opacity: 0.12
                }
              ]}
            />
            <View
              style={[
                styles.iconContainer,
                styles.iconOverlay
              ]}
            >
              <Ionicons
                name="alert-circle-outline"
                size={40}
                color={Colors[colorScheme].tint}
              />
            </View>

            <Animated.View
              entering={FadeInDown.delay(200).springify()}
            >
              <Text
                style={[
                  styles.badge,
                  {
                    color: Colors[colorScheme].tint
                  }
                ]}
              >
                404
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(300).springify()}
            >
              <Text
                style={[
                  styles.title,
                  {
                    color: Colors[colorScheme].text
                  }
                ]}
              >
                {t("page_not_found")}
              </Text>
            </Animated.View>

            <View
              style={[
                styles.divider,
                {
                  backgroundColor: Colors[colorScheme].tint
                }
              ]}
            />

            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              style={styles.buttonWrapper}
            >
              <Button
                title={t("go_to_home")}
                onPress={() => router.replace("/")}
              />
            </Animated.View>
          </Animated.View>
        </View>
      </View>
      <StatusBar
        style={colorScheme === "dark" ? "light" : "dark"}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    gap: 15
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    gap: 16,
    borderWidth: 1
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  iconOverlay: {
    position: "absolute",
    top: 28
  },
  badge: {
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    opacity: 0.8
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center"
  },
  divider: {
    width: "100%",
    height: 1,
    marginVertical: 6,
    opacity: 0.12
  },
  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 8
  }
})

export default NotFoundScreen;
