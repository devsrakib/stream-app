import LogoutConfirmationModal from '@/components/call/LogoutModal'
import { SignedIn,  useAuth,  useUser } from '@clerk/clerk-expo'
import {  MaterialCommunityIcons } from '@expo/vector-icons'
import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { verticalScale } from 'react-native-size-matters'

export default function Page() {
  const { user } = useUser()
  const [isModalVisible, setModalVisible] = useState(false)
const {signOut} = useAuth()
  const handleLogout = () =>{
    console.log('logged out');
    setModalVisible(true)
    
  }

  return (
    <SafeAreaView style={{flex: 1}} >
      <View style={styles.bodyContainer}>
      <SignedIn>
        <Text>Hello</Text>
      </SignedIn>
      <TouchableOpacity onPress={handleLogout}>
      <MaterialCommunityIcons name="exit-run" size={24} color="black" />
      </TouchableOpacity>
      </View>
      <LogoutConfirmationModal visible={isModalVisible} onClose={() => setModalVisible(false)}  onLogout={signOut}  />
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  bodyContainer:{
    justifyContent: 'space-between',
    paddingHorizontal: 20, 
    flexDirection: 'row',
    flex: 1,
  }
})