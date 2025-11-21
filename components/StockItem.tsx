import { CompanyInfo, MarketInfo } from '@/constants/Types'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import {
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native'

interface StockItemProps {
    company: CompanyInfo
    market: MarketInfo
    percent: string
    isUp: boolean
    onPressItem: () => void
}

export default function StockItem({ 
    company,
    market,
    percent,
    isUp,
    onPressItem 
}: StockItemProps) {

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

    const formatPrice = () => {
        if (market?.currentPrice) {
            return !isNaN(market?.currentPrice) ? `$${market?.currentPrice.toFixed(2)}` : '—'
        } else {
            return !isNaN(market?.previousClose) ? `${market?.previousClose.toFixed(4)}` : '—'
        }
    }

    const handlePress = () => {
        onPressItem()
    }

    const animatedStyle = {
        transform: [{ scale: scaleAnim }],
    }

    const price = formatPrice()
    
    return (
        <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        >
          <Animated.View
            style={[
              styles.card,
              animatedStyle,
            ]}
          >
            <View style={styles.content}>
                <View style={styles.left}>
                    <Text style={styles.symbol}>{company.symbol}</Text>
                    <Text style={styles.name} numberOfLines={1} ellipsizeMode='tail'>{company.name}</Text>
                </View>
                <View style={styles.right}>
                    <Text style={styles.price}>
                        { price }
                    </Text>
                    <View style={[styles.pill, isUp ? styles.pillUp : styles.pillDown]}>
                    <Ionicons
                        name={isUp ? 'trending-up-outline' : 'trending-down-outline'}
                        size={14}
                        color="#fff"
                    />
                    <Text style={styles.pillText}>
                        {isUp ? '+' : ''}{percent}%
                    </Text>
                    </View>
                </View>
            </View>
          </Animated.View>
        </Pressable>
    )

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff', 
        marginHorizontal: 16, 
        marginTop: 12, 
        borderRadius: 16, 
        padding: 18, 
        shadowColor: '#000', 
        shadowOffset: { 
            width: 0, 
            height: 1 
        }, 
        shadowOpacity: 0.05, 
        shadowRadius: 2, 
        elevation: 1
    },
    content: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    left: { 
        flex: 1, 
        paddingRight: 12 
    },
    symbol: { 
        fontSize: 22, 
        fontWeight: '700', 
        color: '#1a1a1a', 
        letterSpacing: 0.5 
    },
    name: { 
        fontSize: 14, 
        color: '#666', 
        marginTop: 4 
    },
    right: { 
        alignItems: 'flex-end' 
    },
    price: { 
        fontSize: 21, 
        fontWeight: '600', 
        color: '#1a1a1a' 
    },
    pill: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 11, 
        paddingVertical: 6, 
        borderRadius: 20, 
        marginTop: 8, 
        gap: 5 
    },
    pillUp: { 
        backgroundColor: '#00C853' 
    },
    pillDown: { 
        backgroundColor: '#E53935' 
    },
    pillText: { 
        color: '#fff', 
        fontSize: 13, 
        fontWeight: '600' 
    },
})
