```js
app/
└── (tabs)/
    ├── notification/
    └── home/
        ├── index.tsx
        └── ticker.tsx
```

```js
<View style={styles.statusRow}>
    <View style={[styles.badge, { backgroundColor: '#f66' }]}>
        <Text style={styles.badgeText}>CLOSED</Text>
    </View>
    <Text style={styles.panel}>
        {tradeAgeSeconds !== null ? `${formatAge(tradeAgeSeconds)} ago` : '—'}
    </Text>
    <Text style={styles.panel}>
        {ageSeconds !== null ? `${formatAge(ageSeconds)} ago` : '—'}
    </Text>
</View>
```

```css
statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 },
badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
badgeText: { color: '#fff', fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
panel: { fontSize: 13, color: '#007AFF', fontWeight: '500' },
sourceText: { fontSize: 11, color: '#999' },
```

```js
import * as React from 'react'
import { useWindowDimensions, View } from 'react-native'
import { CartesianChart, Bar } from 'victory-native'
import { LinearGradient, vec } from '@shopify/react-native-skia'
import FontContext from '../store/fontstore'

const getMonthLabel = (date) => {

    if(!date) {
        return ''
    }

    if(typeof date !== 'string') {
        return ''
    }

    const tokens = date.split('-')

    if(tokens.length === 0) {
        return ''
    }
    
    return `${parseInt(tokens[1])}月`

}

export default  function GraphOccupancyRate({
    data = [],
    max = 10,
    height = 250
}) {
    
    const { font } = React.useContext(FontContext)

    const { width: windowWidth } = useWindowDimensions()

    return (
        <View style={{
            height: height,
        }}>
            <CartesianChart 
            data={data} 
            xKey='x'
            yKeys={['y']}
            axisOptions={{ 
                font,
                labelColor: '#a2a2a2',
                lineColor: '#b8b8b8',
                tickCount: {
                    y: 5,
                    x: 12
                },
                formatXLabel: (a) => getMonthLabel(a),
                formatYLabel: (a) => String(a),
            }}
            domain={{y: [0, max]}}
            padding={{
                left: 8,
                right: 8,
            }}
            domainPadding={{ 
                left: windowWidth > 414 ? 48 : 24,
                right: windowWidth > 414 ? 48 : 24
            }}
            >
                {({ points, chartBounds }) => {
                    return (
                        <Bar
                        points={points.y}
                        chartBounds={chartBounds}
                        animate={{ type: 'spring' }}
                        //color='#60C0E0'
                        >
                            <LinearGradient
                            start={vec(0, 0)}
                            end={vec(0, height)}
                            //colors={["#28a7da", "#60e0c0", "#ff409f"]}
                            colors={[ '#2AAAD5', '#BFE6F2' ]}
                            />
                        </Bar>
                    )
                }
                }
            </CartesianChart>
        </View>
    )
}
```

```js
import * as React from 'react'
import { View, StyleSheet, useWindowDimensions } from 'react-native'
import { CartesianChart, Bar } from 'victory-native'
import { LinearGradient, vec } from '@shopify/react-native-skia'
import FontContext from '../store/fontstore'

const getMonthLabel = (date) => {
    if (!date || typeof date !== 'string') return ''
    
    const tokens = date.split('-')
    
    return tokens.length ? `${parseInt(tokens[1], 10)}月` : ''
}

export default function GraphIncomeExpenses({
    data = [],
    max = 20,
    height = 240
}) {

    const { font } = React.useContext(FontContext)

    const { width: windowWidth } = useWindowDimensions()

    return (
        <View style={[styles.container, {
            height: height,
        }]}>
            <CartesianChart 
            data={data} 
            xKey='x'
            yKeys={['y']}
            axisOptions={{ 
                font,
                labelColor: '#a2a2a2',
                lineColor: '#b8b8b8',
                tickCount: {
                    y: 5,
                    x: 12
                },
                formatXLabel: (a) => getMonthLabel(a),
                formatYLabel: (a) => {
                    const b = parseInt(a)
                    if(Math.abs(b) >= 10000) {
                        let c = b / 10000
                        return c % 1 === 0 ? `${c.toFixed(0)}万` : `${c.toFixed(1)}万`
                    } else if(Math.abs(b) >= 1000) {
                        let c = b / 1000
                        return c % 1 === 0 ? `${c.toFixed(0)}千` : `${c.toFixed(1)}千`
                    } else {
                        return String(b)
                    }
                }
            }}
            domain={{y: [-max, max]}}
            padding={{
                left: 8,
                right: 8,
            }}
            domainPadding={{ 
                left: windowWidth > 414 ? 48 : 24,
                right: windowWidth > 414 ? 48 : 24
            }}>
                {({ points, chartBounds }) => {
                    return (
                        <Bar
                        points={points.y}
                        chartBounds={chartBounds}
                        //color='#60C0E0'
                        animate={{ type: 'spring' }}
                        >
                            <LinearGradient
                            start={vec(0, 0)}
                            end={vec(0, height)}
                            //colors={["#28a7da", "#60e0c0", "#ff409f"]}
                            colors={[ '#2AAAD5', '#BFE6F2', '#2AAAD5' ]}
                            />
                        </Bar>
                    )
                }}
            </CartesianChart>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
```