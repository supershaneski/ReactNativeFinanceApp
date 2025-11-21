import { useState } from 'react'

type Severity = 'success' | 'info' | 'warning' | 'error'

let showToast: (message: string, severity?: Severity) => void = () => {}

export const useToast = () => {
  const [toast, setToast] = useState<{ message: string; severity: Severity } | null>(null)

  showToast = (message: string, severity: Severity = 'info') => {
    setToast({ message, severity })
    setTimeout(() => setToast(null), 4000)
  }

  const hideToast = () => setToast(null)

  return { toast, showToast, hideToast }
}