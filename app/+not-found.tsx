import { Colors } from '@/constants/Colors';
import { Link, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const NotFoundScreen = () => {
  const { t } = useTranslation();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>
          {t("page_not_found")}
        </Text>
        <Link href="/" asChild>
          <Pressable style={({ pressed }) => (pressed ? { opacity: 0.7 } : null)}>
            <Text style={styles.link}>
              {t("go_to_home")}
            </Text>
          </Pressable>
        </Link>
      </View>
      <StatusBar style="light" />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 20
  },
  text: {
    fontSize: 24,
    color: Colors.dark.text,
  },
  link: {
    color: Colors.dark.icon,
    fontSize: 20
  }
})

export default NotFoundScreen;
