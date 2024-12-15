import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import { FONTS } from '@/constants/Fonts'
import { Colors } from '@/constants/Colors'
import Button from '@/components/ui/Button'
import { inverseFormatSlug } from '@/lib/slug'
import { useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import { useRouter } from 'expo-router'
import Toast from 'react-native-root-toast'

const join = () => {
  const [roomId, setRooId] = useState<string>('')
const client = useStreamVideoClient();
const router = useRouter();
  const handleJoinRoom = () =>{
    if(!roomId) return

    const slug = inverseFormatSlug(roomId)

    const call = client?.call('default', slug);
    call?.get().then((callResponse) =>{
      router.push(`/(call)/${slug}`)
    }).catch(reason =>{
Toast.show('the room doesn\'t exist',{
  duration: Toast.durations.LONG,
  position: Toast.positions.CENTER,
  shadow: true
})
    })

  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter the Room Name</Text>
      <TextInput style={styles.input} value={roomId} onChangeText={(id) => setRooId(id)} placeholder='enter the room name' />
        <Button onPress={ handleJoinRoom} title='Join Room' titleColor={Colors.white} style={{backgroundColor: Colors.primary, borderRadius: 0, marginTop: 0}} width={'100%'}  />
    </View>
  )
}

export default join

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  title:{
    fontSize: FONTS.REGULAR,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 10
  },
  input:{
width: '100%',
// padding: 20,
paddingHorizontal: 10,
backgroundColor: Colors.white, 
height: 50,
marginTop: 10
  },
})