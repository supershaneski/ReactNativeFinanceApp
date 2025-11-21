import Ionicons from '@expo/vector-icons/Ionicons'
import React, { ComponentProps } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'


type IoniconName = ComponentProps<typeof Ionicons>['name']

interface IconButtonProps {
    icon: IoniconName
    iconColor: string
    text: string
    textColor: string
    backgroundColor: string
    onPress: () => void
}

export default function IconButton({
    icon,
    iconColor,
    text,
    textColor,
    backgroundColor,
    onPress,
}: IconButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
            <Ionicons name={icon} size={20} color={iconColor} />
            <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    text: {
        fontWeight: '600',
    }
})