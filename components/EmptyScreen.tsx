import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { ComponentProps } from 'react'
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native'

type IoniconName = ComponentProps<typeof Ionicons>['name']

interface EmptyScreenProps {
    iconName: IoniconName
    title: string
    text: string
    showBackButton?: boolean
}

export default function EmptyScreen({
    iconName,
    title,
    text,
    showBackButton = false,
}: EmptyScreenProps) {
    const router = useRouter()
    return (
        <View style={styles.container}>
            <Ionicons 
                name={iconName}
                size={48} 
                color='#9CA3AF'
                style={{ marginBottom: 20 }}
            />
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.text}>{text}</Text>
            {
                showBackButton &&
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => router.back()}
                >
                    <Text style={styles.buttonText}>Go Back</Text>
                </TouchableOpacity>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    text: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 32,
        lineHeight: 24,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        backgroundColor: 'transparent',
    },
    buttonText: {
        color: '#374151',
        fontSize: 16,
        fontWeight: '600',
    },
})