import { FinanceStore, StockSummaryData } from '@/constants/Types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const parseTickerResponse = (
    data: any,
    requestedSymbol: string
): StockSummaryData | null => {
    
    if (data && data.company && data.company.symbol) {
        const tmpData = { ...data, clientCachedAt: Date.now() }
        return tmpData as StockSummaryData
    }

    if (typeof data === 'object' && data[requestedSymbol]) {
        const result = data[requestedSymbol]
        if (result.error) {
            throw new Error(result.error)
        }
        const tmpResult = { ...result, clientCachedAt: Date.now() }
        return tmpResult as StockSummaryData
    }

    throw new Error('Invalid response format')
}

const CACHE_TTL_MS = 10 * 60 * 1000

export const useFinanceStore = create<FinanceStore>()(
    persist(
        (set, get) => ({
            isHydrated: false,
            tickers: [],
            history: {},
            loading: false,
            error: null,
            getTicker: async (id: string) => {

                const symbol = id.trim().toUpperCase()
                const { tickers } = get()

                const cached = tickers.find((t) => t.company.symbol === symbol)
                if (cached) {

                    const cachedAt = new Date(cached.clientCachedAt).getTime()
                    const now = Date.now()
                    
                    const isExpired = now - cachedAt > CACHE_TTL_MS

                    if (!isExpired) {
                        console.log(`Cache hit (fresh): ${symbol}`)
                        return
                    }
                }

                try {
                    set({ loading: true, error: null })

                    const url = `${process.env.EXPO_PUBLIC_BASEURL}/ticker?id=${symbol}`
                    const response = await fetch(url, {
                        headers: {
                            'User-Agent': 'FinanceApp/1.0',
                            'Accept': 'application/json',
                        },
                    })

                    if (!response.ok) {
                        const err = await response.json().catch(() => ({}))
                        throw new Error(err.error || err.message || 'Network error')
                    }

                    const data = await response.json()
                    const stockData = parseTickerResponse(data, symbol)

                    set((state) => ({
                        tickers: [
                            ...state.tickers.filter((t) => t.company.symbol !== symbol),
                            stockData,
                        ],
                    }))

                } catch(err: any) {
                    throw err
                } finally {
                    set({ loading: false })
                }
            },
            removeTicker: (id: string) => {
                const symbol = id.trim().toUpperCase()
                console.log(symbol)
                set((state) => ({
                    tickers: state.tickers.filter((t) => t.company.symbol !== symbol)
                }))
            },
            refreshAll: async () => {
                const { tickers } = get()
                if (tickers.length === 0) return

                const now = Date.now()

                const symbols = tickers.filter((t) => {
                    const cachedAt = new Date(t.clientCachedAt).getTime()
                    return now - cachedAt > CACHE_TTL_MS
                }).map((t) => t.company.symbol).join(',')

                if (!symbols) return

                try {
                    set({ loading: true, error: null })

                    const url = `${process.env.EXPO_PUBLIC_BASEURL}/tickers?symbols=${symbols}`
                    const response = await fetch(url, {
                        headers: {
                            'User-Agent': 'FinanceApp/1.0',
                            'Accept': 'application/json',
                        },
                    })

                    if (!response.ok) {
                        throw new Error('Failed to refresh stocks')
                    }

                    const data = await response.json()

                    const updated = tickers.map((old) => {
                        try {
                            const fresh = parseTickerResponse(data, old.company.symbol)
                            return fresh
                        } catch {
                            return old
                        }
                    })

                    set({ tickers: updated })
                } catch (err: any) {
                    throw err
                } finally {
                    set({ loading: false })
                }
            },
            getHistory: async (symbol: string, range: string) => {
                const { history } = get()

                if (history[symbol] && history[symbol][range]) {

                    const cachedAt = new Date(history[symbol][range].cachedAt).getTime() * 1000
                    const now = Date.now()
                    
                    const isExpired = now - cachedAt >  60 * 60 * 1000 // 1 hour
                    if (!isExpired) {
                        console.log(`History cache hit (fresh): ${symbol}`)
                        return
                    }
                }

                try {

                    console.log(`Retrieve history data: ${symbol}`)

                    const url = `${process.env.EXPO_PUBLIC_BASEURL}/history?id=${symbol}&range=${range}`
                    const response = await fetch(url, {
                        headers: {
                            'User-Agent': 'FinanceApp/1.0',
                            'Accept': 'application/json',
                        },
                    })

                    if (!response.ok) {
                        throw new Error('Failed to refresh stocks')
                    }

                    const data = await response.json()

                    if (data[symbol]) {
                        set(state => ({
                            history: {
                                ...state.history,
                                [symbol]: {
                                    ...(state.history[symbol] || {}),
                                    [range]: data[symbol]
                                }
                            }
                        }))
                    }

                } catch(err: any) {
                    throw err
                }

            },
            clearError: () => set({ error: null }),
        }),
        {
            name: 'app-finance-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: () => () => {
                useFinanceStore.setState({ isHydrated: true })
            },
            partialize: (state) => ({ 
                tickers: state.tickers,
                history: state.history,
            }),
        },
    )
)