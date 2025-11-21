import DialogAdd from '@/components/DialogAdd'
import EmptyScreen from '@/components/EmptyScreen'
import StockItem from '@/components/StockItem'
import Toast from '@/components/Toast'
import { useToast } from '@/components/useToast'
import { StockSummaryData } from '@/constants/Types'
import { useFinanceStore } from '@/stores/financestore'
import Ionicons from '@expo/vector-icons/Ionicons'
import * as Haptics from 'expo-haptics'
import { Stack, useRouter } from 'expo-router'
import React from 'react'
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

export default function IndexScreen() {
  const router = useRouter()
  const { toast, showToast } = useToast()

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [refreshing, setRefreshing] = React.useState(false)

  const tickers = useFinanceStore((state) => state.tickers)
  const getTicker = useFinanceStore((state) => state.getTicker)
  const refreshAll = useFinanceStore((state) => state.refreshAll)
  
  React.useEffect(() => {
    const init = async () => {
      try {
        await refreshAll()
      } catch (err: unknown) {
        console.log(err)
        showToast('Failed to refresh', 'error')
      }
    }
    
    init()
  }, [refreshAll])

  const handleAddTicker = async (ticker: string) => {
    await getTicker(ticker)
    setDialogOpen(false)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refreshAll()
      showToast('Watchlist refreshed', 'success')
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      showToast('Failed to refresh', 'error')
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setRefreshing(false)
    }
  }

  const handlePressTicker = (symbol: string) => {
    Haptics.selectionAsync()
    router.push(`/(tabs)/home/${symbol}`)
  }

  const renderItem = ({ item }: { item: StockSummaryData }) => {
    const { company, market } = item

    const currentPrice = market?.currentPrice ?? 0
    const previousClose = market?.previousClose ?? 0

    const change = currentPrice - previousClose
    const percent = ((change / previousClose) * 100).toFixed(4)
    const isUp = change >= 0

    return (
      <StockItem company={company} market={market} percent={percent} isUp={isUp} onPressItem={() => handlePressTicker(company.symbol)} />
    )
  }

  const renderContent = () => {

    if (tickers.length === 0) {
      return (
        <EmptyScreen
          iconName='heart-outline'
          title='No stocks yet'
          text="Tap + to add your first stock"
        />
      )
    }

    return (
      <FlatList
        data={tickers}
        renderItem={renderItem}
        keyExtractor={(item) => item.company.symbol}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Watchlist',
          headerTitleStyle: { fontWeight: '600', fontSize: 20 },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setDialogOpen(true)}
              style={styles.headerButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name='add' size={28} color='#919192' />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {renderContent()}
      </View>
      <DialogAdd
        open={dialogOpen}
        onSubmit={handleAddTicker}
        onClose={() => setDialogOpen(false)}
      />
      <Toast
        message={toast?.message || ''}
        severity={toast?.severity || null}
        onAnimationEnd={() => {}}
      />
    </>
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
  statusText: { 
    marginTop: 16, 
    fontSize: 16, 
    color: '#666' 
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
  headerButton: { 
    padding: 8, 
    marginRight: 8 
  },
})