import { NotificationItem, NotificationStore } from '@/constants/Types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const initialData: NotificationItem[] = [
    { id: '1', type: 'events', title: 'Trade Executed: NASDAQ', snippet: 'Your order to sell 50 shares of TSLA has been filled at $215.45.', detail: "The transaction was completed successfully in the morning trading session. Funds will settle within T+2 business days. View your portfolio for updated holdings.", date: '2025-11-14T10:30:00Z', read: false },
    { id: '2', type: 'alert', title: 'Low Balance Warning', snippet: 'Your checking account balance has dropped below your set threshold of $500.', detail: "Please note that your primary checking account is currently holding $489.12. Consider moving funds from savings or delaying upcoming payments to avoid overdraft fees.", date: '2025-11-13T16:15:00Z', read: false },
    { id: '3', type: 'system', title: 'New Feature Available', snippet: 'Explore our new automatic savings tool, powered by AI.', detail: "We've launched a new feature that analyzes your spending habits and automatically moves small, safe amounts into your dedicated savings account, helping you reach your goals faster. Check out the 'Savings Goals' tab to activate.", date: '2025-11-12T09:00:00Z', read: true },
    { id: '4', type: 'alert', title: 'Suspicious Login Attempt', snippet: 'An unauthorized login attempt was detected from an unknown device in Tokyo, Japan.', detail: "For your security, we have temporarily locked access to your account. Please change your password immediately and contact our fraud department if you did not initiate this login attempt. You must verify your identity to regain full access.", date: '2025-11-10T22:45:00Z', read: true },
    { id: '5', type: 'news', title: 'Loan Repayment Complete', snippet: 'Your scheduled loan repayment of $1,200 has been successfully processed.', detail: "Congratulations, your monthly installment has been successfully debited. Your outstanding loan balance has been updated.", date: '2025-11-09T08:00:00Z', read: true },
    { id: '6', type: 'system', title: 'Annual Statement Ready', snippet: 'Your 2024 annual summary statement is now available for download.', detail: "Find your comprehensive financial summary for the previous year in the documents section of your profile.", date: '2025-11-08T11:00:00Z', read: false },
]

export const useNotificationStore = create<NotificationStore>()(
    persist(
        (set, get) => ({
            isHydrated: false,
            notifications: initialData,
            addNotification: (notif) => {
                const newnotif = { ...notif, read: true }
                set((state) => ({
                    notifications: [
                        newnotif,
                        ...state.notifications.filter((n) => n.id !== notif.id),
                    ],
                }))
            },
            markAsRead: (id: string) => {
                set((state) => ({
                    notifications: state.notifications.map((n) => 
                        n.id === id ? { ...n, read: true } : n
                    ),
                }))
            },
            removeNotification(id) {
                set(state => ({
                    notifications: state.notifications.filter((n) => n.id !== id)
                }))
            },
        }),
        {
            name: 'app-notification-storage',
            storage: createJSONStorage(() => AsyncStorage),
            onRehydrateStorage: (state) => {
                return (state, error) => {
                    if (!error) {
                        useNotificationStore.setState({ isHydrated: true })
                    }
                }
            },
            partialize: (state) => ({ 
                notifications: state.notifications,
            }),
        },
    )
)