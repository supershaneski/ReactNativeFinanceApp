import CustomHeader from '@/components/CustomHeader'
import { Stack } from 'expo-router'
import React from 'react'

export const unstable_settings = {
  initialRouteName: 'index',
}

export default function Layout() {
  return (
      <Stack 
        screenOptions={{
          header: (props) => <CustomHeader {...props} />
        }}
      >
        <Stack.Screen 
          name='index' 
          options={{ 
            headerShown: true,
            title: 'Watchlist'
          }}
        />
        <Stack.Screen 
          name='[ticker]' 
          options={{ 
            headerShown: true,
            title: 'Stock'
          }}
        />
      </Stack>
  )
}
