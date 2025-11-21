import type { SkFont } from '@shopify/react-native-skia'
import React from 'react'

type FontContextType = {
  font: SkFont | null
}

const FontContext = React.createContext<FontContextType>({ font: null })

export default FontContext