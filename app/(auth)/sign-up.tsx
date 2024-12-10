import { View, Text,   Alert, StyleSheet, KeyboardAvoidingView, TextInput, Platform } from 'react-native'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { useSignIn, useSignUp } from '@clerk/clerk-expo'
import { Colors, TABBAR_MAIN_COLOR } from '@/constants/Colors'
import {MaterialIcons} from '@expo/vector-icons'
import {verticalScale} from 'react-native-size-matters'
import { RADIUS } from '@/constants/Radius'
import Divider from '@/components/ui/Divider'
import Button from '@/components/ui/Button'
import { WIDTH } from '@/constants/constants.global'
import { FONTS } from '@/constants/Fonts'
import CustomModal from '@/components/sign-in/CustomModal'
export default function SignUpScreen() {

  const [isModalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); 

  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err: any) {
      if (err?.errors?.[0]?.message) {
        setErrorMessage(err?.errors[0]?.message)
        setModalVisible(true)
      } 
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/')
      } else {
        console.error('Verification failed:', completeSignUp)
      }
    } catch (err: any) {
      if (err?.errors?.[0]?.message) {
        setErrorMessage(err?.errors[0]?.message)
        setModalVisible(true)
      } 
    }
  }


  

  return (
    <KeyboardAvoidingView style={styles.container } behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {!pendingVerification && ( <>
      <Text style={styles.text}>Enter your detail to get started!</Text>
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
      <Button title="Sign Up" onPress={onSignUpPress} titleColor={TABBAR_MAIN_COLOR} width={WIDTH} bold='600' />
      <CustomModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          title="Message"
          message={errorMessage}
          cancelText="Ok"
        /></>)}
      {pendingVerification && (
        <>
        <Text style={styles.text}>A Verification code has been sent to your email please enter it below</Text>
          <TextInput value={code} placeholder="Code..." onChangeText={(code)=> setCode(code)} style={styles.inputs} />
          <Button title="Verify Email" onPress={onPressVerify} width={'90%'} titleColor={Colors.primary}  />
        </>
      )}
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
fontSize: FONTS.MEDIUM,
textAlign: 'center',
marginBottom: 10
  }
})