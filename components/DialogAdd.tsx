import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import React, { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Keyboard,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'

interface DialogAddProps {
  open: boolean
  onSubmit: (ticker: string) => Promise<void>
  onClose: () => void
}

export default function DialogAdd({ open, onSubmit, onClose }: DialogAddProps) {
  const [ticker, setTicker] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (open) {
      setTicker('')
      setError('')
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const handleSubmit = async () => {

    const trimmed = ticker.trim().toUpperCase()
    if (!trimmed) {
      setError('Please enter a ticker symbol')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      return
    }

    setLoading(true)
    setError('')

    try {
      await onSubmit(trimmed)
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch (err: any) {
      setError(err.message || 'Failed to add ticker')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    Keyboard.dismiss()
    onClose()
  }

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={open}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback 
      onPress={() => {}}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <View style={styles.header}>
                <Text style={styles.title}>Add Stock</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name='close' size={24} color='#919192' />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  placeholder='e.g. AAPL, TSLA'
                  placeholderTextColor='#999'
                  value={ticker}
                  onChangeText={Platform.OS === 'android' ? setTicker: (t) => setTicker(t.toUpperCase())}
                  autoCapitalize='characters'
                  autoCorrect={false}
                  returnKeyType='done'
                  keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'default'}
                  onSubmitEditing={handleSubmit}
                  editable={!loading}
                />
                {ticker ? (
                  <TouchableOpacity
                    onPress={() => setTicker('')}
                    style={styles.clearButton}
                  >
                    <Ionicons name='close-circle' size={20} color='#999' />
                  </TouchableOpacity>
                ) : null}
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={handleClose}
                  disabled={loading}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.addButton,
                    loading && styles.addButtonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={loading || !ticker.trim()}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.addButtonText}>Add</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '88%',
    maxWidth: 420,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 17,
    paddingVertical: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 1,
  },
  clearButton: {
    padding: 4,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 13,
    marginTop: 8,
    marginLeft: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: 90,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelText: {
    color: '#666',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  addButtonDisabled: {
    backgroundColor: '#999',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
})