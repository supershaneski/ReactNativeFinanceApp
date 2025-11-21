import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import type { NativeStackHeaderProps, NativeStackNavigationOptions } from '@react-navigation/native-stack'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type CustomOptions = NativeStackNavigationOptions & {
  subtitle?: string
  mode?: number
  onMenuPress?: () => void
  headerLeft?: () => React.ReactNode
  headerRight?: () => React.ReactNode
}

interface BackButtonProps {
    onPress: () => void
}
const BackButton = ({ onPress }: BackButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <MaterialIcons name='arrow-back-ios' size={24} color='#919192' />
        </TouchableOpacity>
    )
}

export default function CustomHeader({ navigation, options }: NativeStackHeaderProps) {
    const [canGoBack, setCanGoBack] = React.useState(false)
  
    const insets = useSafeAreaInsets()
    const { title, subtitle, mode = 0, headerLeft, headerRight } = options as CustomOptions

    React.useEffect(() => {
        const unsubscribe = navigation.addListener("state", () => {
            setCanGoBack(navigation.canGoBack())
        })
        return unsubscribe
    }, [navigation])

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.leftPanel}>
        {canGoBack && mode === 1 && typeof headerLeft !== 'function' && <BackButton onPress={() => navigation.goBack()} />}
        {canGoBack && typeof headerLeft === 'function' && headerLeft()}
        {!canGoBack && typeof headerLeft === 'function' && headerLeft()}
      </View>
      <View style={styles.headerPanel}>
        {title && (
          <Text
            numberOfLines={2}
            ellipsizeMode='tail'
            style={styles.title}
          >
            {title}
          </Text>
        )}
        {subtitle && (
          <Text
            numberOfLines={1}
            ellipsizeMode='tail'
            style={styles.subtitle}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.rightPanel}>
        {headerRight && typeof headerRight === 'function' && headerRight()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  leftPanel: {
    minWidth: 32,
    maxWidth: '20%',
    alignItems: 'flex-start',
  },
  rightPanel: {
    minWidth: 32,
    alignItems: 'flex-end',
  },
  headerPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2A44',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
})