import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Call, CallingState, StreamCall, useStreamVideoClient } from '@stream-io/video-react-native-sdk'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Colors } from '@/constants/Colors'
import CallRoom from '@/components/call/CallRoom'
import {generateSlug} from 'random-word-slugs'
import Toast from 'react-native-root-toast'
import { copySlug } from '@/lib/slug'

export default function CallScreen() {
  const {id} = useLocalSearchParams()
  const [call, setCall] = useState<Call | null | undefined | any>(null)
  const client = useStreamVideoClient();
  const [slug, setSlug] = useState<string | null>(null)

  

  useEffect(() =>{
let slug: string | any;

if(id !== '(call)' && id){
'joining an existing call'
slug = id.toString();
const _call = client?.call('default', slug);
_call?.join({create: false}).then(() =>{
  setCall(_call)
})

}else{
'create a new call'
slug = generateSlug(3, {
  categories:{
    adjective: ['color', 'personality'],
    noun: ['animals', 'food']
  }
})
const _call = client?.call('default', slug);
_call?.join({create: true}).then(() =>{
  Toast.show('You created successfully \n tap here to copy the Call ID to share',{
    duration: Toast.durations.LONG,
    position: Toast.positions.CENTER,
    shadow: true,
    onPress:async () =>{
      copySlug(slug)
    }
  })
  setCall(_call)
})

}
setSlug(slug)
  }, [id, client])

  useEffect(() =>{
if(call?.state?.callingState !== CallingState.LEFT){
  call?.leave()
}
  }, [call])

  if(!call || !slug){
    return(
      <View style={styles.activityCon}>
        <ActivityIndicator size={'large'} color={Colors.primary} />
      </View>
    )
  }
  return (
    <StreamCall call={call}>
     <CallRoom slug={slug} />
    </StreamCall>
  )
}

const styles = StyleSheet.create({
  activityCon:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
})