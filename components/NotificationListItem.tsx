import { NotificationItem } from '@/constants/Types'
import { getIcon } from '@/lib/utils'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocales } from 'expo-localization'
import React from 'react'
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View
} from 'react-native'

interface NotificationListItemProps {
  notification: NotificationItem,
  onPress: () => void
}

export default function NotificationListItem({
  notification,
  onPress,
}: NotificationListItemProps) {
  const locales = useLocales()
  const scaleAnim = React.useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start()
  }

  const handlePress = () => {
    onPress()
  }

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  }

  const formattedTime = new Date(notification.date).toLocaleDateString(locales[0].languageTag, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const isUnread = !notification.read

  const { icon, color } = getIcon(notification.type)

  return (
    <Pressable
    onPress={handlePress}
    onPressIn={handlePressIn}
    onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: color }]}>
          <Ionicons name={icon} size={22} color='#fff' />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.itemTitle, isUnread && styles.itemTitleUnread]} numberOfLines={1}>
              {notification.title}
            </Text>
            {isUnread && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.itemSnippet} numberOfLines={2}>
            {notification.snippet}
          </Text>
          <Text style={styles.itemTime}>{formattedTime}</Text>
        </View>
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16, 
    marginTop: 12, 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    flexShrink: 1,
  },
  itemTitleUnread: {
    fontWeight: '600',
    color: '#1F2937',
  },
  itemSnippet: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  itemTime: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444', //'#3B82F6',
    marginLeft: 10,
  },
})
