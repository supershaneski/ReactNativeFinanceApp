export interface HistoryItem {
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface HistoryInfo {
  data: HistoryItem[]
  cachedAt: number
}

export interface History {
  [ticker: string]: {
    [range: string]: HistoryInfo
  }
}

export interface FinanceStore {
    isHydrated: boolean
    loading: boolean
    error: null | string
    tickers: any[]
    history: History
    getTicker: (id: string) => Promise<void>
    removeTicker: (id: string) => void
    refreshAll: () => Promise<void>
    getHistory: (id: string, range: string) => Promise<void>
    clearError: () => void
}

export type CustomError = Error & {
    details?: {
        status?: string
        error?: string
        created?: string
        [key: string]: any
    }
    statusCode?: number
}

export interface CompanyInfo {
  name: string
  symbol: string
  industry: string
  sector: string
}

export interface MarketInfo {
  currentPrice: number
  previousClose: number
  fiftyTwoWeekRange: string
  marketCap: number
}

export interface PerformanceInfo {
  trailingPE: number
  forwardPE: number
  dividendYield: number
  earningsGrowth: number
  revenueGrowth: number
}

export interface AnalystInfo {
  recommendation: string
  targetMeanPrice: number
}

export interface MetaDataInfo {
  cachedAt: string
  lastTradeAt: string
  marketState: string
}

export interface StockSummaryData {
  company: CompanyInfo
  market: MarketInfo
  performance: PerformanceInfo
  analyst: AnalystInfo
  metadata: MetaDataInfo
  clientCachedAt: string | undefined
}

export type NotificationType =
  | 'alert'      // price alerts, thresholds, watchlist triggers
  | 'news'       // market or company news
  | 'events'     // earnings, dividends, scheduled financial events
  | 'system'     // app/system messages

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  snippet: string
  detail: string
  date: string
  read: boolean
}

export type NotificationStore = {
  isHydrated: boolean
  notifications: NotificationItem[]
  addNotification: (n: NotificationItem) => void
  removeNotification: (id: string) => void
  markAsRead: (id: string) => void
}
