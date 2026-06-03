import { usePathname } from 'expo-router';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';

import ChatFAB from '@/components/chatFabs/chatFab';
import { activeTab, Colors } from '@/constants/Colors';
import { useTabsHistoryContext } from '@/stores/context/tabsHistoryContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { Text, useColorScheme } from 'react-native';

const TabLayout = () => {

  const { t } = useTranslation();
  const pathname = usePathname();
  const colorscheme = useColorScheme() || "light";
  const tabTriggerColor = Colors[colorscheme].tint;

  const {
    setPathname
  } = useTabsHistoryContext();

  useEffect(() => {
    if (
      pathname === "/auth/signIn" ||
      pathname === "/auth/signUp"
    )
      return;
    setPathname(pathname);
  }, [pathname])

  return (
    <Tabs style={styles.tabs}>
      <TabSlot />
      <TabList style={styles.tabList}>
        <TabTrigger
          name="index"
          href="/"
          style={styles.tabTrigger}
        >
          <Ionicons name="search" size={30} style={{ color: pathname === "/" ? activeTab : tabTriggerColor }} />
          <Text style={[styles.tabText, { color: pathname === "/" ? activeTab : tabTriggerColor }]}>{t("find_parking")}</Text>
        </TabTrigger>
        <TabTrigger
          name="book"
          href="/book"
          style={styles.tabTrigger}
        >
          <Ionicons name="book" size={30} style={{ color: pathname === "/book" ? activeTab : tabTriggerColor }} />
          <Text style={[styles.tabText, { color: pathname === "/book" ? activeTab : tabTriggerColor }]}>{t("book_parking")}</Text>
        </TabTrigger>
        <TabTrigger
          name="trackingCar"
          href="/trackingCar"
          style={styles.tabTrigger}
        >
          <Ionicons name="car" size={30} style={{ color: pathname === "/trackingCar" ? activeTab : tabTriggerColor }} />
          <Text style={[styles.tabText, { color: pathname === "/trackingCar" ? activeTab : tabTriggerColor }]}>{t("tracking_car")}</Text>
        </TabTrigger>
        <TabTrigger
          name="account"
          href="/account"
          style={styles.tabTrigger}
        >
          <Ionicons name="person" size={30} style={{ color: pathname === "/account" ? activeTab : tabTriggerColor }} />
          <Text style={[styles.tabText, { color: pathname === "/account" ? activeTab : tabTriggerColor }]}>{t("profile")}</Text>
        </TabTrigger>
      </TabList>
      <ChatFAB />
      <StatusBar style="auto" />
    </Tabs>

  )
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1
  },
  tabList: {
    padding: 25,
    paddingTop: 10
  },
  tabTrigger: {
    alignItems: "center"
  },
  tabText: {
    minWidth: 60,
    maxWidth: 80,
    textAlign: "center",
    fontSize: 14
  }
})

export default TabLayout;