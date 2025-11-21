import { MarketInfo, MetaDataInfo } from '@/constants/Types'
import Ionicons from '@expo/vector-icons/Ionicons'
import { StyleSheet, Text, View } from 'react-native'
import StockStatus from './StockStatus'

interface StockHeaderProps {
    market: MarketInfo
    isUp: boolean
    change: number
    percent: string
    metadata: MetaDataInfo
}

export default function StockHeader({
    market,
    isUp,
    change,
    percent,
    metadata,
}: StockHeaderProps) {
    const formatPrice = () => {
        if (market?.currentPrice) {
            return !isNaN(market?.currentPrice) ? `$${market?.currentPrice.toFixed(2)}` : '—'
        } else {
            return !isNaN(market?.previousClose) ? `${market?.previousClose.toFixed(4)}` : '—'
        }
    }

    const price = formatPrice()

    return (
        <View style={styles.priceSection}>
          <Text style={styles.currentPrice}>
            {
              price
            }
          </Text>
          <View style={styles.changeRow}>
            <Ionicons
              name={isUp ? 'trending-up' : 'trending-down'}
              size={20}
              color={isUp ? '#00C853' : '#E53935'}
            />
            <Text style={[styles.changeValue, isUp ? styles.up : styles.down]}>
              {isUp ? '+' : ''}{change.toFixed(2)} ({percent}%)
            </Text>
          </View>
          <Text style={styles.previousClose}>
            Previous close: ${market.previousClose.toFixed(2)}
          </Text>

          <StockStatus metadata={metadata} />

        </View>
    )
}

const styles = StyleSheet.create({
    priceSection: {
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    currentPrice: {
        fontSize: 36,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    changeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 6,
    },
    changeValue: {
        fontSize: 18,
        fontWeight: '600',
    },
    up: { 
        color: '#00C853' 
    },
    down: { 
        color: '#E53935' 
    },
    previousClose: {
        marginTop: 8,
        fontSize: 15,
        color: '#666',
    },
})