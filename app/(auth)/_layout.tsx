import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { Redirect, Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, TABBAR_MAIN_COLOR } from '@/constants/Colors'

const AuthRoutesLayout = () => {
    const {isSignedIn} = useAuth()
    if(isSignedIn){
       return <Redirect href={'/(call)'} />
    }
  return (
   <SafeAreaView style={{flex: 1, backgroundColor: TABBAR_MAIN_COLOR}}>
    <Stack >
        <Stack.Screen 
        name='sign-in'
        options={{
            title: 'Sign in to get started',
headerShown: false
        }}
        />
        <Stack.Screen 
        name='sign-up'
        options={{
            title: 'Sign up',
            headerBackTitle: 'Sign Up',
            headerStyle: {backgroundColor: TABBAR_MAIN_COLOR},
            headerTintColor: Colors.white
        }}
        />
    </Stack>
   </SafeAreaView>
  )
}

export default AuthRoutesLayout