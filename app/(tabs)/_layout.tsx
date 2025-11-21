import { useNotificationStore } from '@/stores/notificationstore'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs } from 'expo-router'
import React from 'react'

import { useClientOnlyValue } from '@/components/useClientOnlyValue'

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name']
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />
}

export const unstable_settings = {
  initialRouteName: '/(tabs)/home',
}

export default function TabLayout() {
  const unreadCount = useNotificationStore((state) => state.notifications.filter((a) => !a.read).length)
  return (
    <Tabs
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#3B82F6',
        tabBarBadgeStyle: {
          backgroundColor: '#EF4444',
          color: '#FFFFFF',
        },
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name='home'
        options={{
          headerShown: false,
          title: 'Following',
          tabBarIcon: ({ color }) => <TabBarIcon name='trending-up-outline' color={color} />,
        }}
      />
      <Tabs.Screen
        name='notification'
        options={{
          headerShown: false,
          title: 'Notifications',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarIcon: ({ color }) => <TabBarIcon name='notifications-outline' color={color} />,
        }}
      />
    </Tabs>
  )
}

/*
<Tabs.Screen
        name="index"
        options={{
          title: 'Tab One',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />*/