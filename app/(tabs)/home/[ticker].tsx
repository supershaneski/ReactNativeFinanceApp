import DisplayGraph from '@/components/DisplayGraph'
import EmptyScreen from '@/components/EmptyScreen'
import IconButton from '@/components/IconButton'
import StockHeader from '@/components/StockHeader'
import Toast from '@/components/Toast'
import { useToast } from '@/components/useToast'
import { useFinanceStore } from '@/stores/financestore'
import * as Haptics from 'expo-haptics'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'

export default function TickerScreen() {
  const router = useRouter()
  const { toast, showToast } = useToast()

  const { ticker } = useLocalSearchParams<{ ticker: string }>()

  const [range, setRange] = React.useState('1D')
  const [refreshing, setRefreshing] = React.useState(false)
  
  const symbol = ticker?.toUpperCase()
  const stock = useFinanceStore((state) => state.tickers.find((s) => s.company.symbol === symbol))
  const history = useFinanceStore((state) => state.history[symbol]?.[range])
  const getTicker = useFinanceStore((state) => state.getTicker)
  const removeTicker = useFinanceStore((state) => state.removeTicker)
  const getHistory = useFinanceStore((state) => state.getHistory)
  const removeHistory = useFinanceStore((state) => state.removeHistory)

  React.useEffect(() => {
    getHistory(symbol, range)
  }, [symbol, range])

  const handleRemove = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    removeTicker(symbol)
    removeHistory(symbol)
    router.back()
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await getTicker(symbol)
      await getHistory(symbol, range)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      showToast('Failed to refresh', 'error')
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setRefreshing(false)
    }
  }

  if (!stock) {
    return (
      <>
        <Stack.Screen 
          options={{
            title: symbol || 'Stock',
            // @ts-expect-error — intentional type mismatch
            mode: 1,
          }} 
        />
        <EmptyScreen
          iconName='trending-up-outline'
          title='Stock Not Found'
          text={`We could not locate data for ${symbol}. It may have been removed or the ticker is incorrect.`}
          showBackButton={true}
        />
      </>
    )
  }

  const isInWatchlist = !!stock

  const { company, market, performance, analyst, metadata } = stock

  const currentPrice = market?.currentPrice ?? 0
  const previousClose = market?.previousClose ?? 0

  const change = currentPrice - previousClose
  const percent = ((change / previousClose) * 100).toFixed(2)
  const isUp = change >= 0

  return (
    <>
      <Stack.Screen
        options={{
          title: company.symbol,
          // @ts-expect-error — intentional type mismatch
          subtitle: company.name,
          mode: 1,
        }}
      />
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
      >
        <StockHeader
          market={market}
          isUp={isUp}
          change={change}
          percent={percent}
          metadata={metadata}
        />
        {/*
          history &&
          <View style={styles.section}>
            <DisplayGraph history={history} range={range} onRangeSelect={(a) => setRange(a)} />
          </View>
        */}
        <View style={styles.section}>
          <DisplayGraph history={history} range={range} onRangeSelect={(a) => setRange(a)} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Market Stats</Text>
          <View style={styles.grid}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Market Cap</Text>
              <Text style={styles.statValue}>
                {market?.marketCap != null
                ? `$${(market.marketCap / 1e9).toFixed(2)}B`
                : 'N/A'}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>52W Range</Text>
              <Text style={styles.statValue}>{market.fiftyTwoWeekRange}</Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.grid}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Trailing P/E</Text>
              <Text style={styles.statValue}>
                {performance?.trailingPE != null
                ? performance.trailingPE.toFixed(2)
                : 'N/A'}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Forward P/E</Text>
              <Text style={styles.statValue}>
                {performance?.forwardPE != null
                ? performance.forwardPE.toFixed(2)
                : 'N/A'}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Dividend Yield</Text>
              <Text style={styles.statValue}>
                {performance?.dividendYield != null
                ? `${(performance.dividendYield * 100).toFixed(2)}%`
                : 'N/A'}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Revenue Growth</Text>
              <Text style={styles.statValue}>
                {performance?.revenueGrowth != null
                ? `${(performance.revenueGrowth * 100).toFixed(1)}%`
                : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Analyst Opinion</Text>
          <View style={styles.analystCard}>
            <Text style={styles.analystRating}>
              {analyst.recommendation?.replace('_', ' ').toUpperCase() || 'N/A'}
            </Text>
            <Text style={styles.targetPrice}>
              {analyst?.targetMeanPrice != null
              ? `Target: $${analyst.targetMeanPrice.toFixed(2)}`
              : 'Target: N/A'}
            </Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Sector</Text>
            <Text style={styles.infoValue}>{company.sector || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Industry</Text>
            <Text style={styles.infoValue}>{company.industry || 'N/A'}</Text>
          </View>
        </View>
        {isInWatchlist && (
          <View style={styles.removeSection}>
            <IconButton 
            icon='trash-outline'
            iconColor='#e74c3c'
            text='Remove from Watchlist'
            textColor='#e74c3c'
            backgroundColor='#ffebee'
            onPress={handleRemove}
            />
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
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
    backgroundColor: '#f9f9f9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  headerTitle: {
    maxWidth: 200,
  },
  headerSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  headerName: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  headerButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center', 
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  stat: {
    width: '46%',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginTop: 4,
  },
  analystCard: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  analystRating: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  targetPrice: {
    marginTop: 8,
    fontSize: 16,
    color: '#1a1a1a',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  removeSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
})