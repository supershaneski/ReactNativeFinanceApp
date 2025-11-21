import { HistoryInfo } from '@/constants/Types'
import FontContext from '@/hooks/fontcontext'
import { formatTimestamp } from '@/lib/utils'
import { LinearGradient, vec } from '@shopify/react-native-skia'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import { Area, CartesianChart, Line } from 'victory-native'

interface DisplayGraphProps {
    history: HistoryInfo
    range?: '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y' | string
    onRangeSelect: (a: string) => void
}

interface Datum {
  x: string
  y: { close: number }
}

export default function DisplayGraph({ history, range = '1D', onRangeSelect }: DisplayGraphProps) {
    const { height } = useWindowDimensions()
    const { font } = React.useContext(FontContext)

    const rawData = history?.data
    const hasData = rawData && Array.isArray(rawData) && rawData.length > 0

    const data = hasData 
        ? rawData.map((a) => ({
              timestamp: formatTimestamp(a.timestamp, range),
              close: a.close,
          }))
        : []

    if (!history || !hasData) {
        return (
            <View>
                <View style={styles.buttonGroups}>
                    {['1D','1W','1M','3M','1Y','5Y'].map((a) => (
                        <TouchableOpacity 
                            key={a} 
                            //onPress={() => onRangeSelect(a)} 
                            style={[styles.button, { backgroundColor: a === range ? '#3399ff' : '#fff' }]}
                        >
                            <Text style={[styles.text, { color: a === range ? '#fff' : '#111' }]}>
                                {a}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View style={{ height: height * 0.25, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#888', fontSize: 14 }}>
                        {history === undefined || history === null 
                            ? 'Loading price data...' 
                            : 'No price data available for this range'}
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View>
            <View style={styles.buttonGroups}>
                {
                    ['1D','1W','1M','3M','1Y','5Y'].map((a) => (
                        <TouchableOpacity onPress={() => onRangeSelect(a)} key={a} style={[styles.button, {
                            backgroundColor: a === range ? '#3399ff' : '#fff',
                        }]}>
                            <Text style={[styles.text, {
                                color: a === range ? '#fff' : '#111',
                            }]}>{a}</Text>
                        </TouchableOpacity>
                    ))
                }
            </View>
            <View style={{
                height: height * 0.25,
            }}>
                <CartesianChart
                    data={data}
                    xKey='timestamp'
                    yKeys={['close']}
                    padding={{ left: 10, right: 10, bottom: 5, top: 20 }}
                    axisOptions={{
                        font,
                        tickCount: {
                            y: 5,
                            x: 6
                        },
                        formatXLabel: (a) => {
                            return a
                        },
                        formatYLabel: (b) => {
                            return `${String(b)}`
                        },
                    }}
                >
                    {({ points, chartBounds }) => (
                        data.length === 0 ? null : (
                            <>
                                <Area
                                    points={points.close}
                                    y0={chartBounds.bottom}
                                    animate={{ type: 'timing', duration: 300 }}
                                >
                                    <LinearGradient
                                        start={vec(0, 0)}
                                        end={vec(0, chartBounds.bottom)}
                                        colors={[
                                            '#80bfff',
                                            '#b3d9ff33',
                                        ]}
                                    />
                                </Area>
                                <Line
                                    points={points.close}
                                    color='#3399ff'
                                    strokeWidth={1}
                                />
                            </>
                        )
                    )}
                </CartesianChart>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonGroups: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    button: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    text: {
        fontSize: 12,
        lineHeight: 15,
        fontWeight: '600',
    },
})