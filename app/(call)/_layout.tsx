import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Redirect, Tabs } from 'expo-router'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import { Colors, TABBAR_MAIN_COLOR } from '@/constants/Colors'
import { useAuth, useUser } from '@clerk/clerk-expo'
import {
    StreamCall,
    StreamVideo,
    StreamVideoClient,
    User,
    Logger
  } from "@stream-io/video-react-native-sdk";


const apiKey = process.env.EXPO_PUBLIC_GET_STEAM_API_KEY

if(!apiKey){
    throw new Error('Missing api key')
}

const CallRoutesLayout = () => {
    const { isSignedIn } = useAuth()
    const {user:clerkUser} = useUser();


    if (!isSignedIn || !clerkUser || !apiKey) {
        return <Redirect href={'/(auth)/sign-in'} />
    }

    const tokenProvider = async () =>{
const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/generateUserToken`, {
    method: 'POST',
    headers:{
        'Content-type':'application/json'
    },
    body:JSON.stringify({
        userId: clerkUser?.id,
        name: clerkUser?.fullName,
        image: clerkUser?.imageUrl,
        email: clerkUser?.primaryEmailAddress?.toString()
    })
})
const data = await response.json();
return data?.token
    }

    const user:User = {
        id: clerkUser?.id,
        name: clerkUser?.firstName!,
        image: clerkUser?.imageUrl

    }

    const myLogger: Logger = (logLevel, message, ...args) => {
       
      };
    const client = StreamVideoClient.getOrCreateInstance({
        apiKey,
        tokenProvider,
        user,
        options: {
          logLevel: "info",
          logger: myLogger,
        },
      });

    
    return (
        <SafeAreaView style={styles.container}>
            <StreamVideo client={client}>

           
            <Tabs screenOptions={({ route }) => ({
                header: () => null,
                tabBarStyle: {
                    display: route.name === '[id]' ? 'none' : 'flex'
                },
                tabBarLabelStyle: {
                    zIndex: 100,
                    paddingBottom: 5
                },
                tabBarActiveTintColor: TABBAR_MAIN_COLOR
            })} >

                <Tabs.Screen
                    name='index'
                    options={{
                        title: 'All Call',
                        tabBarIcon: ({ color }
                        ) => (
                            <Ionicons name='call-outline' size={20} color={color} />
                        )
                    }}
                />
                <Tabs.Screen
                    name="[id]"
                    options={{
                        title: 'Start a next call',
                        // unmountOnBlur: true,
                        header: () => null,
                        // tabBarStyle: { display: 'none' },
                        tabBarIcon: ({ color }) => {
                            return (
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        top: -14,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: 'auto',
                                        // borderRadius: 40,
                                        borderTopRightRadius: 20,
                                        borderTopLeftRadius: 20,
                                        zIndex: 100,
                                        backgroundColor: Colors.white,
                                        borderColor: Colors.lightGray,
                                        borderTopWidth: 1,
                                        borderWidth: 0.2,
                                        borderBottomWidth: 0,
                                        paddingHorizontal: 10,
                                        width: 80
                                    }}
                                >
                                    <FontAwesome
                                        name="plus-circle"
                                        size={30}
                                        color={Colors.black}
                                        style={{ zIndex: 200 }}
                                    />
                                </View>
                            );
                        },
                    }}
                />

                <Tabs.Screen
                    name='join'
                    options={{
                        title: 'Join Call',
                        tabBarIcon: ({ color }
                        ) => (
                            <Ionicons name='enter-outline' size={20} color={color} />
                        )
                    }}
                />
            </Tabs>
            </StreamVideo>
        </SafeAreaView>
    )
}

export default CallRoutesLayout


const styles = StyleSheet.create({
    container: {
        flex: 1,

    }
})