import EmptyScreen from '@/components/EmptyScreen'
import NotificationListItem from '@/components/NotificationListItem'
import { NotificationItem } from '@/constants/Types'
import { useNotificationStore } from '@/stores/notificationstore'
import { router } from 'expo-router'
import React from 'react'
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native'

export default function NotificationListScreen() {
  const notifications = useNotificationStore((state) => state.notifications)

  const [refreshing, setRefreshing] = React.useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    // Mock refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }

  const handlePressItem = (id: string) => {
    router.push(`/(tabs)/notification/${id}`)
  }

  const renderItem = ({ item }: { item: NotificationItem }) => {
    return (
      <NotificationListItem notification={item} onPress={() => handlePressItem(item.id)} />
    )
  }

  const renderContent = () => {
    
    if (notifications.length === 0) {
      return (
        <EmptyScreen
          iconName='notifications-outline'
          title='No notifications'
          text="You're all caught up! Check back later for updates."
        />
      )
    }

    return (
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#007AFF']}
            tintColor='#007AFF'
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    )
  }

  return (
    <View style={styles.container}>
      {renderContent()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f9f9f9' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 40 
  },
  emptyTitle: { 
    marginTop: 20, 
    fontSize: 20, 
    fontWeight: '600', 
    color: '#333' 
  },
  emptyText: { 
    marginTop: 8, 
    fontSize: 15, 
    color: '#888', 
    textAlign: 'center' 
  },
})