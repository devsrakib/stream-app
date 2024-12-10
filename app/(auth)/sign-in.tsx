import { View, Text,   Alert, StyleSheet, KeyboardAvoidingView, TextInput, Platform } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { useSignIn } from '@clerk/clerk-expo'
import { Colors, TABBAR_MAIN_COLOR } from '@/constants/Colors'
import {MaterialIcons} from '@expo/vector-icons'
import {verticalScale} from 'react-native-size-matters'
import { RADIUS } from '@/constants/Radius'
import Divider from '@/components/ui/Divider'
import Button from '@/components/ui/Button'
import { WIDTH } from '@/constants/constants.global'
import { FONTS } from '@/constants/Fonts'
import CustomModal from '@/components/sign-in/CustomModal'
import  SignInWithOAuth  from '@/components/SignInWithOAuth'

export default function SignUpScreen() {

  const [isModalVisible, setModalVisible] = useState(false);

  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  
  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')// Modal visibility state
  const [errorMessage, setErrorMessage] = useState(''); 
  
  const onSignInPress = React.useCallback(async () => {
    if (!isLoaded) {
      return
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      }
    } catch (err: any) {
      setErrorMessage(err?.errors[0]?.message || 'An unexpected error occurred.'); // Set error message
      setModalVisible(true); // Show modal
    }
  }, [isLoaded, emailAddress, password])

  

  return (
    <KeyboardAvoidingView style={styles.container } behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <MaterialIcons name='video-chat' size={100} color={Colors.white}/>
    <TextInput
    style={styles.inputs}
      autoCapitalize="none"
      value={emailAddress}
      placeholder="Email..."
      onChangeText={(emailAddress)=> setEmailAddress(emailAddress)}
    />
    <TextInput
    style={styles.inputs}

      value={password}
      placeholder="Password..."
      secureTextEntry={true}
      onChangeText={(password)=> setPassword(password)}
    />
    <Divider CWidth='96%'/>
    <Button title="Sign In" onPress={onSignInPress} titleColor={TABBAR_MAIN_COLOR} width={WIDTH} bold='600' />
    <Text style={styles.or}>or</Text>
    <SignInWithOAuth />
    <Divider CWidth='95%' />
    <View style={styles.routerCon}>
      <Text style={styles.text}>Don't have an account?</Text>
      <Link href="/sign-up">
        <Text style={styles.text}>Sign up</Text>
      </Link>
    </View>
    <CustomModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        title="Message"
        message={errorMessage}
        cancelText="Ok"
      />
  </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1, 
    backgroundColor: TABBAR_MAIN_COLOR,
alignItems: 'center',
justifyContent: 'center',
paddingHorizontal: 20,

  },
  inputs:{
    height: 46,
    width: verticalScale(300),
backgroundColor: Colors.white,
borderRadius: RADIUS.MEDIUM,
marginBlock: 10,
paddingHorizontal: 10
  },
  or:{
    color: Colors.white,
    // marginTop: 14,
    fontSize: FONTS.LARGE
  },
  routerCon:{
    alignItems: 'center',
    gap: 10,
    marginTop: 20
  },
  text:{
    color: Colors.white,

  }
})