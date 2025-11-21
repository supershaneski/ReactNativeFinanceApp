import { NotificationType } from '@/constants/Types';

export const formatTimestamp = (timestamp: number | string | Date, timeframe: '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y' | string): string => {
  const date = new Date(timestamp)

  switch (timeframe) {
    case '1D':
      return date.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }); // → 14:30

    case '1W':
    case '1M':
    case '3M':
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }); // → Nov 18  (or you can use 'ja-JP' → 11月18日)

    case '1Y':
      return date.toLocaleDateString('en-US', { month: 'short' }); // → Nov
      // Alternative with year if you prefer: date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) → Nov 2025

    case '5Y':
    default:
      return date.toLocaleDateString('en-US', { year: 'numeric' }) // → 2025
  }
}

export const IconMap = {
  events: { icon: 'trending-up-outline', color: '#10B981' },
  system: { icon: 'information-circle-outline', color: '#F59E0B' },
  news: { icon: 'newspaper-outline', color: '#3B82F6' },
  alert: { icon: 'warning-outline', color: '#EF4444' },
} as const

export function getIcon(t: NotificationType) {
  return IconMap[t]
}

