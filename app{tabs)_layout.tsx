import { Tabs } from "expo-router";
import { Home, Package, Palette, Library } from "lucide-react-native";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TabLayout() {
  const { t } = useLanguage();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#94a3b8",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#e2e8f0",
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.home,
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: t.tabs.products,
          tabBarIcon: ({ color, size }) => <Package color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="customize"
        options={{
          title: t.tabs.customize,
          tabBarIcon: ({ color, size }) => <Palette color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: t.tabs.library,
          tabBarIcon: ({ color, size }) => <Library color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
