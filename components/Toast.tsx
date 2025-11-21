import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import React from 'react'
import {
    Animated,
    Easing,
    StyleSheet,
    Text,
    useWindowDimensions,
    View
} from 'react-native'

type SeverityIcon = 'check-circle-outline' | 'info-outline' | 'warning-amber' | 'error-outline'

type SeverityMapItem = {
    color: string
    iconName: SeverityIcon
}

type SeverityOption = 'success' | 'info' | 'warning' | 'error' | null

type SeverityMap = {
    [key in 'success' | 'info' | 'warning' | 'error']: SeverityMapItem;
}

const severityMap: SeverityMap = {
    'success': {
        color: '#7ce9a4',
        iconName: 'check-circle-outline'
    },
    'info': {
        color: '#60a5fa',
        iconName: 'info-outline'
    },
    'warning': {
        color: '#eab308',
        iconName: 'warning-amber'
    },
    'error': {
        color: '#EF4444',
        iconName: 'error-outline'
    },
}

interface ToastProps {
    message: string
    backgroundColor?: string
    severity: SeverityOption
    onAnimationEnd: () => void
}

const Toast = ({ 
    message, 
    backgroundColor = '#333', 
    onAnimationEnd = () => {},
    severity,
}: ToastProps) => {
    const { height } = useWindowDimensions()
    const translateY = React.useRef(new Animated.Value(height)).current
    const isAnimating = React.useRef(false)

    React.useEffect(() => {
        if (message && !isAnimating.current) {
            isAnimating.current = true

            Animated.sequence([
                Animated.spring(translateY, {
                    toValue: -50,
                    useNativeDriver: true,
                    bounciness: 4,
                    speed: 12,
                }),
                Animated.delay(2000),
                Animated.timing(translateY, {
                    toValue: height,
                    duration: 600,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start(() => {
                isAnimating.current = false
                translateY.setValue(height)
                onAnimationEnd()
            })
        }
    }, [message, translateY, height, onAnimationEnd])

    const toastStyleColor = severity ? severityMap[severity].color : backgroundColor
    const icon = severity ? <MaterialIcons name={severityMap[severity].iconName} color='#fff' size={24} /> : null

    if (!message) {
        return null
    }
    
    return (
        <Animated.View 
        style={[
            styles.toast,
            {
                backgroundColor: toastStyleColor,
                transform: [{ translateY }]
            },
            !message && { opacity: 0, pointerEvents: 'none' }
        ]}
        >
            <View style={styles.contentContainer}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <Text style={styles.text}>{message}</Text>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        bottom: 40,
        padding: 12,
        width: '70%',
        borderRadius: 8,
        zIndex: 999,
        alignSelf: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        color: '#FFFFFF',
        flexShrink: 1,
    },
})

export default Toast