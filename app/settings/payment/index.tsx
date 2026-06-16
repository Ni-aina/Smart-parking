import Header from "@/components/ui/header";
import { Colors } from "@/constants/Colors";
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

const Payment = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";

  return (
    <View style={styles.container}>
      <Header title={t("payment")} />

      <View style={styles.content}>
        <Animated.View
          entering={FadeInUp.delay(100).springify()}
          style={[
            styles.card,
            { backgroundColor: Colors[colorScheme].background }
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: Colors[colorScheme].tint, opacity: 0.12 }
            ]}
          />
          <View style={[styles.iconContainer, styles.iconOverlay]}>
            <Text style={styles.icon}>💳</Text>
          </View>

          <Animated.View
            entering={FadeInDown.delay(200).springify()}
          >
            <Text
              style={[styles.badge, { color: Colors[colorScheme].tint }]}
            >
              {t("coming_soon")}
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300).springify()}
          >
            <Text
              style={[styles.title, { color: Colors[colorScheme].text }]}
            >
              {t("payment")}
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).springify()}
          >
            <Text
              style={[styles.description, { color: Colors[colorScheme].text }]}
            >
              {t("payment_coming_soon_description")}
            </Text>
          </Animated.View>

          <View style={[styles.divider, { backgroundColor: Colors[colorScheme].tint }]} />

          <Animated.View
            entering={FadeInDown.delay(500).springify()}
            style={styles.features}
          >
            {[
              t("payment_secure_payments"),
              t("payment_fast_checkout"),
              t("payment_multiple_currencies")
            ].map(
              (feature, i) => (
                <View
                  key={i}
                  style={[
                    styles.featureRow,
                    { borderColor: Colors[colorScheme].tint }
                  ]}
                >
                  <Text style={[styles.featureText, { color: Colors[colorScheme].text }]}>
                    {feature}
                  </Text>
                </View>
              )
            )}
          </Animated.View>
        </Animated.View>
      </View>
    </View>
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
    paddingBottom: 60
  },
  card: {
    width: "100%",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4
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
  icon: {
    fontSize: 36
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    opacity: 0.8
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center"
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 8,
    opacity: 0.6
  },
  divider: {
    width: "100%",
    height: 1,
    marginVertical: 4,
    opacity: 0.12
  },
  features: {
    width: "100%",
    gap: 8
  },
  featureRow: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 0.5,
    opacity: 0.7
  },
  featureText: {
    fontSize: 14
  }
})

export default Payment;