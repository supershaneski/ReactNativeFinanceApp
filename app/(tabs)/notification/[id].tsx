import EmptyScreen from '@/components/EmptyScreen'
import IconButton from '@/components/IconButton'
import { getIcon } from '@/lib/utils'
import { useNotificationStore } from '@/stores/notificationstore'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocales } from 'expo-localization'
import {
  Stack,
  useLocalSearchParams,
  useRouter
} from 'expo-router'
import React from 'react'
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'

export default function NotificationDetailScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const notifId = Array.isArray(id) ? id[0] : id ?? '';
  const locales = useLocales()

  const notification = useNotificationStore((state) => state.notifications.find((a) => a.id === notifId))
  const markAsRead = useNotificationStore((state) => state.markAsRead)
  const removeNotification = useNotificationStore((state) => state.removeNotification)

  React.useEffect(() => {
    if (notification && !notification.read) {
      markAsRead(notification.id)
    }
  }, [notification, markAsRead])

  const handleRemove = () => {
    removeNotification(notifId)
    router.back()
  }

  if (!notification) {
    return (
      <>
        <Stack.Screen
          options={{
            // @ts-expect-error — intentional type mismatch
            mode: 1,
          }}
        />
        <EmptyScreen
          iconName='notifications-outline'
          title='Notification Not Found'
          text='We could not locate this notification. It may have been deleted or expired.'
          showBackButton={true}
        />
      </>
    )
  }

  const formattedDate = new Date(notification.date).toLocaleString(locales[0].languageTag, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const { icon, color } = getIcon(notification.type)

  return (
    <>
      <Stack.Screen
        options={{
          // @ts-expect-error — intentional type mismatch
          mode: 1,
        }}
      />
      <ScrollView
      style={styles.scrollview}
      contentContainerStyle={styles.container}
      >
        <View style={styles.detailContent}>
          <View style={styles.detailIconContainer}>
              <View style={[styles.detailIconCircle, { backgroundColor: color }]}>
                  <Ionicons name={icon} size={32} color='#fff' />
              </View>
          </View>
          <Text style={styles.detailTitle}>{notification.title}</Text>
          <Text style={styles.detailDate}>{formattedDate}</Text>
          <View style={styles.divider} />
          <Text style={styles.detailBody}>{notification.detail}</Text>
          <View style={styles.removeSection}>
            <IconButton 
            icon='trash-outline'
            iconColor='#e74c3c'
            text='Remove Notification'
            textColor='#e74c3c'
            backgroundColor='#ffebee'
            onPress={handleRemove}
            />
          </View>
          <Text style={styles.footerNote}>
              This is an automated system notification. Please refer to your account documents for legal details.
          </Text>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  scrollview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
  },
  detailIconContainer: {
    marginBottom: 24,
    marginTop: 10,
  },
  detailIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailIconText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  detailDate: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 24,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 24,
  },
  detailBody: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
    textAlign: 'justify',
    marginBottom: 40,
  },
  removeSection: {
    marginBottom: 4,
    width: '100%',
  },
  footerNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingBottom: 20,
    lineHeight: 18,
  },
})