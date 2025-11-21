import { MetaDataInfo } from '@/constants/Types'
import Ionicons from '@expo/vector-icons/Ionicons'
import React, { ComponentProps } from 'react'
import { StyleSheet, Text, View } from 'react-native'

const formatAge = (sec: number) => {
    const sign = sec < 0 ? '-' : ''
    const absSec = Math.abs(sec)
    if (absSec < 60) return `${sign}${absSec}s`
    if (absSec < 3600) return `${sign}${Math.floor(absSec / 60)}m`
    if (absSec < 86400) return `${sign}${Math.floor(absSec / 3600)}h`
    return `${sign}${Math.floor(absSec / 86400)}d`
}

type MarketState = 'regular' | 'pre' | 'post' | 'closed'

type IoniconName = ComponentProps<typeof Ionicons>['name']

const MARKET_CONFIG: Record<MarketState, { label: string; color: string, icon: IoniconName }> = {
  regular: { label: 'LIVE', color: '#00C853', icon: 'flash' as const },
  pre:     { label: 'PRE',  color: '#FFA726', icon: 'time-outline' as const },
  post:    { label: 'POST', color: '#FFA726', icon: 'time-outline' as const },
  closed:  { label: 'CLOSED', color: '#999', icon: 'moon-outline' as const },
}

interface StockStatusProps {
    metadata: MetaDataInfo
}

export default function StockStatus({ metadata }: StockStatusProps) {
    const [now, setNow] = React.useState(Date.now())

    React.useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000)
        return () => clearInterval(interval)
    }, [])

    const getMarketBadge = () => {
        const state = metadata?.marketState as MarketState | undefined
        const config = state && MARKET_CONFIG[state]
        if (!config) return null
        
        return (
        <View style={[styles.badge, { backgroundColor: config.color }]}>
            <Ionicons name={config.icon} size={12} color='#fff' />
            <Text style={styles.badgeText}>{config.label}</Text>
        </View>
        )
    }

    const cachedAt = metadata?.cachedAt 
        ? new Date(metadata.cachedAt).getTime() 
        : now
    const lastTradeAt = metadata?.lastTradeAt
        ? new Date(metadata.lastTradeAt).getTime()
        : null
    
    const ageSeconds = Math.floor((now - cachedAt) / 1000)
    const tradeAgeSeconds = lastTradeAt ? Math.floor((now - lastTradeAt) / 1000) : null


    return (
        <View style={styles.statusRow}>
            { getMarketBadge() }
            <View style={styles.timeItem}>
                <Ionicons name='pulse' size={14} color='#00C853' />
                <Text style={styles.timeValue}>
                    {tradeAgeSeconds !== null ? formatAge(tradeAgeSeconds) : '—'}
                </Text>
                <Text style={styles.timeLabel}>trade</Text>
            </View>
            <View style={styles.timeItem}>
                <Ionicons name='cloud-done' size={14} color='#007AFF' />
                <Text style={styles.timeValue}>
                    {ageSeconds ? formatAge(ageSeconds) : '—'}
                </Text>
                <Text style={styles.timeLabel}>cached</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 12,
        flexWrap: 'wrap',
    },
    timeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    timeValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    timeLabel: {
        fontSize: 10,
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        minHeight: 28,
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
    },
})